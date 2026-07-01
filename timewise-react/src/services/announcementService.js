import api from './api'

export const announcementService = {
  getAnnouncements() {
    return api.get('/announcements')
  },
}
