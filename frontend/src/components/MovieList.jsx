// src/components/MovieList.jsx
import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {movies.map((movie) => (
        <MovieCard key={movie.movieId} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
