import api from './api'

export const postService = {
  getAllPosts() {
    return api.get('/posts')
  },

  getFeaturedThought() {
    return api.get('/posts/featured')
  },

  createPost(data) {
    return api.post('/posts', data)
  },
}
