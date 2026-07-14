import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],

  featured: null,

  loading: false,
}

const postSlice = createSlice({
  name: 'post',

  initialState,

  reducers: {
    setPosts(state, action) {
      state.posts = action.payload
    },

    setFeaturedPost(state, action) {
      state.featured = action.payload
    },

    addPost(state, action) {
      state.posts.unshift(action.payload)
    },

    updatePost(state, action) {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id,
      )

      if (index !== -1) {
        state.posts[index] = action.payload
      }

      if (state.featured && state.featured._id === action.payload._id) {
        state.featured = action.payload
      }
    },

    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post._id !== action.payload)

      if (state.featured && state.featured._id === action.payload) {
        state.featured = null
      }
    },

    setPostLoading(state, action) {
      state.loading = action.payload
    },

    clearPosts(state) {
      state.posts = []
      state.featured = null
      state.loading = false
    },
  },
})

export const {
  setPosts,
  setFeaturedPost,
  addPost,
  updatePost,
  deletePost,
  setPostLoading,
  clearPosts,
} = postSlice.actions

export default postSlice.reducer
