import axios from 'axios';
import { Movie, MovieDetailItem, MovieDetailViewModel } from './types';

import api from './apiClient';

export async function fetchMovies(): Promise<Movie[]> {
  const response = await api.get<Movie[]>('/api/movies');
  return response.data;
}

export async function fetchMovieDetail(id: string): Promise<MovieDetailViewModel> {
  const res = await api.get<MovieDetailItem[]>(`/api/movies/${id}`);
  const data = res.data;

  if (!data || data.length === 0) throw new Error("No data returned");

  const { title, poster } = data[0];

  return {
    title,
    poster,
    prices: data.map((m) => ({
      provider: m.provider,
      price: m.price,
    })),
  };
}