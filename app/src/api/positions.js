import api from './index';

export const positionsApi = {
  getAll() {
    return api.get('/positions');
  },

  getById(id) {
    return api.get(`/positions/${id}`);
  },

  create(data) {
    return api.post('/positions', data);
  },

  update(id, data) {
    return api.patch(`/positions/${id}`, data);
  },

  delete(id) {
    return api.delete(`/positions/${id}`);
  },
};