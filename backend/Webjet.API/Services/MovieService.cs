using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Webjet.API.Models;

namespace Webjet.API.Services;

public class MovieService : IMovieService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly ILogger<MovieService> _logger;

    public MovieService(IHttpClientFactory httpClientFactory, IMemoryCache cache, ILogger<MovieService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _logger = logger;
    }

    private async Task<MovieListResponse?> GetMovies(string provider)
    {
        var cacheKey = $"movies_{provider}";

        if (_cache.TryGetValue<MovieListResponse>(cacheKey, out var cachedResponse))
        {
            _logger.LogInformation("Cache HIT for {CacheKey}", cacheKey);
            return cachedResponse;
        }

        _logger.LogInformation("Cache MISS for {CacheKey}, calling API...", cacheKey);

        try
        {
            var client = _httpClientFactory.CreateClient("WebjetAPI");
            var response = await client.GetAsync($"api/{provider}/movies");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var deserialized = JsonSerializer.Deserialize<MovieListResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Only cache if the response is valid and has data
            if (deserialized?.Movies != null && deserialized.Movies.Count > 0)
            {
                _logger.LogInformation("Fetched {Count} movies from {Provider}", deserialized.Movies.Count, provider);
                _cache.Set(cacheKey, deserialized, TimeSpan.FromMinutes(10));
            }
            else
            {
                _logger.LogWarning("Received empty movie list from {Provider}", provider);
            }

            return deserialized;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch movie list from {Provider}", provider);
            return null;
        }
    }

    public async Task<List<MovieSummary>> GetAllMoviesAsync()
    {
        var cinemaTask = GetMovies("cinemaworld");
        var filmTask = GetMovies("filmworld");

        await Task.WhenAll(cinemaTask, filmTask);

        var all = new List<MovieSummary>();

        if (cinemaTask.Result?.Movies != null)
            all.AddRange(cinemaTask.Result.Movies.Select(m => new MovieSummary
            {
                ID = m.ID,
                Title = m.Title,
                Year = m.Year,
                Type = m.Type,
                Poster = m.Poster,
                Provider = "Cinemaworld"
            }));

        if (filmTask.Result?.Movies != null)
            all.AddRange(filmTask.Result.Movies.Select(m => new MovieSummary
            {
                ID = m.ID,
                Title = m.Title,
                Year = m.Year,
                Type = m.Type,
                Poster = m.Poster,
                Provider = "Filmworld"
            }));

        return all;
    }

    public async Task<List<MovieDetail>> GetMovieDetailsAsync(string id)
    {
        var match = Regex.Match(id, @"\d+$");
        if (!match.Success)
            return new List<MovieDetail>();

        var numericId = match.Value;
        var ids = new List<(string Provider, string Id)>
        {
            ("cinemaworld", $"cw{numericId}"),
            ("filmworld", $"fw{numericId}")
        };

        async Task<MovieDetail?> GetDetail(string provider, string movieId)
        {
            var cacheKey = $"movie_{movieId}";

            if (_cache.TryGetValue<MovieDetail>(cacheKey, out var cachedDetail))
            {
                _logger.LogInformation("Cache HIT for detail {MovieId}", movieId);
                return cachedDetail;
            }

            _logger.LogInformation("Cache MISS for detail {MovieId}, calling API...", movieId);

            try
            {
                var client = _httpClientFactory.CreateClient("WebjetAPI");
                var response = await client.GetAsync($"api/{provider}/movie/{movieId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var deserialized = JsonSerializer.Deserialize<MovieDetail>(json, options);

                if (deserialized != null && !string.IsNullOrWhiteSpace(deserialized.Title))
                {
                    _logger.LogInformation("Fetched movie detail: {Title} ({MovieId})", deserialized.Title, movieId);
                    _cache.Set(cacheKey, deserialized, TimeSpan.FromMinutes(10));
                }
                else
                {
                    _logger.LogWarning("Movie detail returned empty for {MovieId}", movieId);
                }

                if (deserialized == null)
                    return null;

                // deserialized.ID = movieId;
                deserialized.Provider = provider;

                return deserialized;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch movie detail {MovieId}", movieId);
                return null;
            }
        }

        var tasks = ids.Select(i => GetDetail(i.Provider, i.Id)).ToArray();
        var results = await Task.WhenAll(tasks);

        return results
            .Where(m => m != null)
            .Select(m => m!)
            .OrderBy(m => m.Price)
            .ToList();
    }
}
