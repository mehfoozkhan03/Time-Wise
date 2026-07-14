import api from "../services/api"

export const authService = {
  signup(data) {
    return api.post("/user/signup", data);
  },

  login(data) {
    return api.post('/user/login', data);
  },

  // signup(data) {
  //   return api.post('/user/signup', data);
  // },

  logout() {
    return api.post('/auth/logout');
  },

  getCurrentUser() {
    return api.get('/auth/me');
  },
};
