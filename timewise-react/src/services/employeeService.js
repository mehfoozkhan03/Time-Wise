import api from './api'

export const employeeService = {
  getProfile() {
    return api.get('/employees/me')
  },

  updateProfile(data) {
    return api.put('/employees/me', data)
  },

  getPerformance() {
    return api.get('/employees/performance')
  },
}
