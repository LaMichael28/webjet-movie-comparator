import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MoviesPage from './Pages/MoviesPage';
import MovieDetailPage from './Pages/MovieDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </Router>
  );
}


export default App;
