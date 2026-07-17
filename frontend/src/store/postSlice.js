import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { postService } from '../services/postService'

// ======================================================
// Fetch Featured Thought
// ======================================================

export const fetchFeaturedThought = createAsyncThunk(
  'post/fetchFeaturedThought',

  async (_, thunkAPI) => {
    try {
      const { data } = await postService.getFeaturedThought()

      return data.featuredThought
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch featured thought',
      )
    }
  },
)

const initialState = {
  posts: [],

  featured: null,

  loading: false,

  isError: false,

  errorMessage: '',
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
      state.isError = false
      state.errorMessage = ''
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedThought.pending, (state) => {
        state.loading = true
        state.isError = false
      })

      .addCase(fetchFeaturedThought.fulfilled, (state, action) => {
        state.loading = false
        state.featured = action.payload
      })

      .addCase(fetchFeaturedThought.rejected, (state, action) => {
        state.loading = false
        state.isError = true
        state.errorMessage = action.payload
      })
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
