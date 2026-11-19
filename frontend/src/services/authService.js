import api from './api'

export const authService = {
  signup(data) {
    return api.post('/user/signup', data)
  },

  login(data) {
    return api.post('/user/login', data)
  },

  logout() {
    return api.post('/user/logout')
  },

  getCurrentUser() {
    return api.get('/user/me')
  },

  // Update profile, including an optional profile image
  updateProfile(data) {
    return api.patch('/user/profile', data)
  },

  // Fetch another user's profile, including their profile image
  getUserProfile(userId) {
    return api.get(`/user/profile/${userId}`)
  },

  updateActivity() {
    return api.patch('/user/activity')
  },

  updateSocialLinks(socialLinks) {
    return api.patch('/user/social-links', socialLinks)
  },

  updateEmergencyContact(emergencyContact) {
    return api.patch('/user/emergency-contact', emergencyContact)
  },
}
