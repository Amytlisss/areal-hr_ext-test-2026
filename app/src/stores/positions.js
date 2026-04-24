import { defineStore } from 'pinia';
import api from '../api/index';

export const usePositionsStore = defineStore('positions', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll(search = '') {
      this.loading = true;
      this.error = null;
      try {
        const url = search ? `/positions?search=${search}` : '/positions';
        const response = await api.get(url);
        this.list = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async create(data) {
      this.loading = true;
      try {
        const response = await api.post('/positions', data);
        this.list.unshift(response.data);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(id, data) {
      this.loading = true;
      try {
        const response = await api.patch(`/positions/${id}`, data);
        const index = this.list.findIndex(item => item.id === id);
        if (index !== -1) {
          this.list[index] = response.data;
        }
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async delete(id) {
      this.loading = true;
      try {
        await api.delete(`/positions/${id}`);
        this.list = this.list.filter(item => item.id !== id);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});