import axios from 'axios';

export const API_URL = 'http://192.168.0.102:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;
