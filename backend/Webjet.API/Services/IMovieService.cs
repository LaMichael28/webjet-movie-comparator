using Webjet.API.Models;

namespace Webjet.API.Services;

public interface IMovieService
{
    Task<List<MovieSummary>> GetAllMoviesAsync();
    Task<List<MovieDetail>> GetMovieDetailsAsync(string id);
}
