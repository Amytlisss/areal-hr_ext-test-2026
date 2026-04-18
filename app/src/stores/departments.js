import { defineStore } from 'pinia';
import { departmentsApi } from '../api/departments';

export const useDepartmentsStore = defineStore('departments', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const response = await departmentsApi.getAll();
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
        const response = await departmentsApi.create(data);
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
        const response = await departmentsApi.update(id, data);
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
        await departmentsApi.delete(id);
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