// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const [imgSrc, setImgSrc] = useState(movie.poster);

    const handleImageError = () => {
        setImgSrc('https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg');
    };

    return (
        <div className="rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition">
            <img
                src={imgSrc}
                alt={movie.title}
                onError={handleImageError}
                className="w-full max-h-[450px] object-cover rounded"
            />
            <div className="mt-2">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm text-gray-600">{movie.year}</p>
                {/* <p className="text-green-600 font-semibold">From ${movie.cheapestPrice}</p> */}
                <Link
                    to={`/movie/${movie.id}`}
                    className="inline-block mt-2 text-blue-500 underline"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default MovieCard;
