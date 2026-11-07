
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const TOKEN_KEY = 'cinetrack_auth_token';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,

  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!token) {
        set({ user: null, token: null, isLoading: false });
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await api.get('/user');

      set({
        user: response.data,
        token,
        isLoading: false,
      });
    } catch (error) {
      console.log('Auth initialization error:', error.message);

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      delete api.defaults.headers.common.Authorization;

      set({ user: null, token: null, isLoading: false });
    }
  },

  register: async (name, email, password, passwordConfirmation) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/login', {
      email,
      password,
    });

    const { user, token } = response.data;

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    set({ user, token });

    return response.data;
  },

  googleLogin: async () => {
    throw new Error(
      'Google Sign-In requires a development build. Please use email login for now.'
    );
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.log('Logout API error:', error.message);
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      delete api.defaults.headers.common.Authorization;
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
