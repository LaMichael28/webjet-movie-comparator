import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetail } from '../api';
import { MovieDetailViewModel } from '../types';

function MovieDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieDetailViewModel | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id)
        .then(setMovie)
        .catch(err => {
          console.error(err);
          setError("Movie details could not be loaded.");
        });
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-gray-600">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const cheapest = movie.prices.reduce((a, b) => (a.price < b.price ? a : b));

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-6 text-center">{movie.title}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full md:w-48 h-[320px] object-cover rounded-lg shadow-md self-center"
          onError={(e) =>
          (e.currentTarget.src =
            'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg')
          }
        />

        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Available Prices</h2>
          <ul className="space-y-3">
            {movie.prices.map((p) => (
              <li
                key={p.provider}
                className="flex justify-between items-center p-3 border rounded-lg shadow-sm hover:shadow-lg transition cursor-default"
              >
                <span className="font-medium">{p.provider}</span>
                <span className="text-lg font-semibold flex items-center space-x-2">
                  <span>${p.price.toFixed(2)}</span>
                  {p.provider === cheapest.provider && (
                    <span className="text-green-600 font-bold" title="Cheapest option">
                      🟢 Cheapest
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 inline-flex items-center px-4 py-2 font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition shadow-sm"
      >
        Back
      </button>
    </div>
  );
}

export default MovieDetailPage;
