import api from './api';

export const authService = {
  signup(data) {
    return api.post('/user/signup', data);
  },

  login(data) {
    return api.post('/user/login', data);
  },

  logout() {
    return api.post('/user/logout');
  },

  getCurrentUser() {
    return api.get('/user/me');
  },
};
