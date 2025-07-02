using System.Net;
using System.Net.Http.Json;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Webjet.API;
using Webjet.API.Services;
using Webjet.API.Models;

namespace Webjet.Tests;

public class APITests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly Mock<IMovieService> _movieServiceMock;

    public APITests()
    {
        _movieServiceMock = new Mock<IMovieService>();

        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove original IMovieService
                services.RemoveAll(typeof(IMovieService));

                // Replace with mocked one
                services.AddSingleton(_movieServiceMock.Object);
            });
        });
    }

    [Fact]
    public async Task GetMovies_ReturnsOk_WithMovies()
    {
        // Arrange
        _movieServiceMock.Setup(svc => svc.GetAllMoviesAsync()).ReturnsAsync(new List<MovieSummary>
        {
            new MovieSummary { ID = "cw001", Title = "The Matrix" },
            new MovieSummary { ID = "fw002", Title = "Interstellar" }
        });

        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/movies");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var movies = await response.Content.ReadFromJsonAsync<List<MovieSummary>>();
        Assert.NotNull(movies);
        Assert.Equal(2, movies.Count);
    }

    [Fact]
    public async Task GetMovieDetails_ReturnsNotFound_WhenNull()
    {
        // Return null (or empty list) to simulate not found
        _movieServiceMock.Setup(svc => svc.GetMovieDetailsAsync("unknown")).ReturnsAsync((List<MovieDetail>?)null);

        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/movies/unknown");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetMovieDetails_ReturnsOk_WhenMovieExists()
    {
        var expectedMovies = new List<MovieDetail>
        {
            new MovieDetail { ID = "cw001", Title = "The Matrix", Price = 10.5m, Provider = "cinemaworld" },
            new MovieDetail { ID = "fw001", Title = "The Matrix", Price = 9.99m, Provider = "filmworld" }
        };

        _movieServiceMock.Setup(svc => svc.GetMovieDetailsAsync("cw001")).ReturnsAsync(expectedMovies);

        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/movies/cw001");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var movies = await response.Content.ReadFromJsonAsync<List<MovieDetail>>();
        Assert.NotNull(movies);
        Assert.Equal(2, movies.Count);
        Assert.Contains(movies, m => m.Provider == "cinemaworld");
        Assert.Contains(movies, m => m.Provider == "filmworld");
    }
}
