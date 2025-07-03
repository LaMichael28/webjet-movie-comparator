// src/pages/MoviesPage.jsx
import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';

const MoviesPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState([]); // Stores movie list from API
  const [loading, setLoading] = useState(true); // Loading state for skeleton UI

  useEffect(() => {
    // Fetch movie list from backend on initial render
    setError(null);
    axios
      .get(`${process.env.REACT_APP_API_BASE}/api/movies`)
      .then((res) => setMovies(res.data))
      .catch((err) => {
        console.error('Failed to fetch movies', err);
        setError("Failed to load movies. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    // Show loading skeletons while fetching
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white rounded-xl shadow p-4 space-y-4"
          >
            <div className="bg-gray-300 h-48 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    // Show error message with retry button
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

  // Render movie list when loaded successfully
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Movies</h1>
      <MovieList movies={movies} />
    </div>
  );
};

export default MoviesPage;
