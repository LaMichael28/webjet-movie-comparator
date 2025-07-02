import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetail } from '../api';
import { MovieDetailViewModel } from '../types';

function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailViewModel | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id).then(setMovie).catch(console.error);
    }
  }, [id]);

  if (!movie) return <p>Loading...</p>;

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
