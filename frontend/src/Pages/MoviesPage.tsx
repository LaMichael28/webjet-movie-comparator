// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE}/api/movies`)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error('Failed to fetch movies', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center p-8">Loading movies...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Compare Movie Prices</h1>
      <MovieList movies={movies} />
    </div>
  );
};

export default MoviesPage;
