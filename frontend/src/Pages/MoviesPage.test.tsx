// src/pages/MoviesPage.test.tsx
import axios from 'axios';
jest.mock('axios');

import React from 'react';
import { render, screen } from '@testing-library/react';
import MoviesPage from './MoviesPage'; // Make sure this path matches your actual file location
import { BrowserRouter } from 'react-router-dom';

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockMovies = [
  { movieId: 1, title: 'The Matrix', year: 1999 },
  { movieId: 2, title: 'Inception', year: 2010 },
];

beforeEach(() => {
  mockedAxios.get.mockReset();
});

test('displays movies after loading', async () => {
  mockedAxios.get.mockResolvedValue({ data: mockMovies });

  render(
    <BrowserRouter>
      <MoviesPage />
    </BrowserRouter>
  );

  // Wait for one of the movie titles to appear
  expect(await screen.findByText(/The Matrix/i)).toBeInTheDocument();

  // Check that heading exists
  expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument();
});

test('shows error message on failure', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network Error'));

  render(
    <BrowserRouter>
      <MoviesPage />
    </BrowserRouter>
  );

  expect(await screen.findByText(/failed to load movies/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
});
