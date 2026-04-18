import api from './index';

export const employeesApi = {
  getAll(search = '') {
    const url = search ? `/employees?search=${search}` : '/employees';
    return api.get(url);
  },

  getById(id) {
    return api.get(`/employees/${id}`);
  },

  create(data) {
    return api.post('/employees', data);
  },

  update(id, data) {
    return api.patch(`/employees/${id}`, data);
  },

  delete(id) {
    return api.delete(`/employees/${id}`);
  },
};