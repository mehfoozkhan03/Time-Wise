import api from './api'

export const thoughtService = {
  getFeaturedThought() {
    return api.get('/thoughts/featured')
  },

  getAllThoughts() {
    return api.get('/thoughts')
  },

  createThought(data) {
    return api.post('/thoughts', data)
  },

  likeThought(id) {
    return api.post(`/thoughts/${id}/like`)
  },

  bookmarkThought(id) {
    return api.post(`/thoughts/${id}/bookmark`)
  },
}
