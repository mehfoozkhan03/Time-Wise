import api from './api'

export const postService = {
  // =====================================================
  // Posts
  // =====================================================

  getAllPosts(page = 1, limit = 10, sort = 'newest') {
    return api.get('/posts', {
      params: {
        page,
        limit,
        sort,
      },
    })
  },

  getPost(id) {
    return api.get(`/posts/${id}`)
  },

  getFeaturedThought() {
    return api.get('/posts/featured')
  },

  createPost(data) {
    return api.post('/posts', data)
  },

  updatePost(id, data) {
    return api.patch(`/posts/${id}`, data)
  },

  deletePost(id) {
    return api.delete(`/posts/${id}`)
  },

  togglePostLike(id) {
    return api.post(`/posts/${id}/like`)
  },

  // =====================================================
  // Comments
  // =====================================================

  getComments(postId, page = 1, limit = 10) {
    return api.get(`/posts/${postId}/comments`, {
      params: {
        page,
        limit,
      },
    })
  },

  createComment(postId, text) {
    return api.post(`/posts/${postId}/comments`, {
      text,
    })
  },

  updateComment(commentId, text) {
    return api.patch(`/posts/comments/${commentId}`, {
      text,
    })
  },

  deleteComment(commentId) {
    return api.delete(`/posts/comments/${commentId}`)
  },

  toggleCommentLike(commentId) {
    return api.post(`/posts/comments/${commentId}/like`)
  },

  // =====================================================
  // Search & Trending
  // =====================================================

  searchPosts(query) {
    return api.get('/posts/search', {
      params: {
        q: query,
      },
    })
  },

  getTrendingPosts() {
    return api.get('/posts/trending')
  },

  getTopContributors() {
    return api.get('/posts/contributors/top')
  },
}
