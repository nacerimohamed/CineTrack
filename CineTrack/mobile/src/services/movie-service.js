import api from './api';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const getTrendingMovies = async (page = 1) => {
  const response = await api.get('/movies/trending', {
    params: { page },
  });

  return response.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const response = await api.get('/movies/top-rated', {
    params: { page },
  });

  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await api.get('/movies/search', {
    params: { query, page },
  });

  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await api.get(`/movies/${id}`);

  return response.data;
};

export const getMoviePoster = (path, size = 'w500') => {
  if (!path) return null;

  return `${IMAGE_BASE_URL}${size}${path}`;
};