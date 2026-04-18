import { defineStore } from 'pinia';
import { organizationsApi } from '../api/organizations';

export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    list: [],           
    loading: false,     
    error: null,        
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await organizationsApi.getAll();
        this.list = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Ошибка загрузки организаций:', this.error);
      } finally {
        this.loading = false;
      }
    },

    async create(data) {
      this.loading = true;
      try {
        const response = await organizationsApi.create(data);
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
        const response = await organizationsApi.update(id, data);
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
        await organizationsApi.delete(id);
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