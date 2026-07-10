import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
}

const postSlice = createSlice({
  name: 'post',

  initialState,

  reducers: {
    setPosts(state, action) {
      state.posts = action.payload
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
    },

    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post._id !== action.payload)
    },

    clearPosts(state) {
      state.posts = []
    },
  },
})

export const { setPosts, addPost, updatePost, deletePost, clearPosts } =
  postSlice.actions

export default postSlice.reducer
