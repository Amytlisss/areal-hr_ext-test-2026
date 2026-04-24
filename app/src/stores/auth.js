import { defineStore } from 'pinia';
import api from '../api/index';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role?.name === 'admin',
    isHrManager: (state) => state.user?.role?.name === 'hr_manager',
  },

  actions: {
    async login(login, password) {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', { login, password });
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },

    async checkAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        try {
          const response = await api.get('/auth/me');
          this.user = response.data;
        } catch (err) {
          this.logout();
        }
      }
    },
  },
});