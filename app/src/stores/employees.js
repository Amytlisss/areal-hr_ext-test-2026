import { defineStore } from 'pinia';
import api from '../api/index';

export const useEmployeesStore = defineStore('employees', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        let url = '/employees?';
        const params = [];
        if (filters.search) params.push(`search=${filters.search}`);
        if (filters.departmentId) params.push(`departmentId=${filters.departmentId}`);
        if (filters.isDismissed) params.push(`isDismissed=${filters.isDismissed}`);
        url += params.join('&');
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
        const response = await api.post('/employees', data);
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
        const response = await api.patch(`/employees/${id}`, data);
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
        await api.delete(`/employees/${id}`);
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