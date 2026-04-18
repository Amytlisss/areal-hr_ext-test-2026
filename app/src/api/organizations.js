import api from './index';

export const organizationsApi = {
  getAll() {
    return api.get('/organizations');
  },

  getById(id) {
    return api.get(`/organizations/${id}`);
  },

  create(data) {
    return api.post('/organizations', data);
  },

  update(id, data) {
    return api.patch(`/organizations/${id}`, data);
  },

  delete(id) {
    return api.delete(`/organizations/${id}`);
  },
};