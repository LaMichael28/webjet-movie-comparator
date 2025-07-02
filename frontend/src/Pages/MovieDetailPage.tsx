import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetail } from '../api';
import { MovieDetailViewModel } from '../types';

function MovieDetailPage() {
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
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const cheapest = movie.prices.reduce((a, b) => (a.price < b.price ? a : b));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-48 h-[300px] object-cover mb-4 rounded"
        onError={(e) =>
        (e.currentTarget.src =
          'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg')
        }
      />
      <h2 className="text-xl font-semibold mb-2">Prices:</h2>
      <ul className="space-y-2">
        {movie.prices.map((p) => (
          <li key={p.provider} className="flex justify-between">
            <span>{p.provider}</span>
            <span>
              ${p.price?.toFixed(2)}{' '}
              {p.provider === cheapest.provider && (
                <strong className="text-green-600">🟢 Cheapest</strong>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetailPage;
