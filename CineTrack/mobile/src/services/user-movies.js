import api from './api';

export const getUserMovies = async (status = null) => {
  const response = await api.get('/user/movies', {
    params: status ? { status } : {},
  });

  return response.data;
};

export const addUserMovie = async (movieId, status = 'watchlist') => {
  const response = await api.post('/user/movies', {
    movie_id: movieId,
    status,
  });

  return response.data;
};

export const updateUserMovie = async (movieId, data) => {
  const response = await api.patch(`/user/movies/${movieId}`, data);

  return response.data;
};

export const removeUserMovie = async (movieId) => {
  const response = await api.delete(`/user/movies/${movieId}`);

  return response.data;
};
