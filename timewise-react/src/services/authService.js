import api from './api'

export const authService = {
  login(data) {
    return api.post('/auth/login', data)
  },

  logout() {
    return api.post('/auth/logout')
  },

  getCurrentUser() {
    return api.get('/auth/me')
  },
}
