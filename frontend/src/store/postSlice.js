import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { postService } from '../services/postService'

// ======================================================
// THUNKS
// ======================================================

export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async ({ page = 1, limit = 10, sort = 'newest' } = {}, thunkAPI) => {
    try {
      const { data } = await postService.getAllPosts(page, limit, sort)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch posts',
      )
    }
  },
)

export const fetchPost = createAsyncThunk(
  'post/fetchPost',
  async (id, thunkAPI) => {
    try {
      const { data } = await postService.getPost(id)
      return data.post
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch post',
      )
    }
  },
)

export const createNewPost = createAsyncThunk(
  'post/createNewPost',
  async (postData, thunkAPI) => {
    try {
      const { data } = await postService.createPost(postData)
      return data.post
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to create post',
      )
    }
  },
)

export const updateExistingPost = createAsyncThunk(
  'post/updateExistingPost',
  async ({ id, postData }, thunkAPI) => {
    try {
      const { data } = await postService.updatePost(id, postData)
      return data.post
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to update post',
      )
    }
  },
)

export const deleteExistingPost = createAsyncThunk(
  'post/deleteExistingPost',
  async (id, thunkAPI) => {
    try {
      await postService.deletePost(id)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to delete post',
      )
    }
  },
)

export const toggleLikePost = createAsyncThunk(
  'post/toggleLikePost',
  async (id, thunkAPI) => {
    try {
      const { data } = await postService.togglePostLike(id)

      return {
        id,
        liked: data.liked,
        likesCount: data.likesCount,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to like post',
      )
    }
  },
)

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

// ======================================================
// COMMENT THUNKS
// ======================================================

export const fetchComments = createAsyncThunk(
  'post/fetchComments',
  async (postId, thunkAPI) => {
    try {
      const { data } = await postService.getComments(postId)

      return {
        postId,
        comments: data.comments,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch comments',
      )
    }
  },
)

export const createNewComment = createAsyncThunk(
  'post/createNewComment',
  async ({ postId, text }, thunkAPI) => {
    try {
      const { data } = await postService.createComment(postId, text)

      return {
        postId,
        comment: data.comment,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to create comment',
      )
    }
  },
)

export const deleteExistingComment = createAsyncThunk(
  'post/deleteExistingComment',
  async ({ postId, commentId }, thunkAPI) => {
    try {
      await postService.deleteComment(commentId)

      return {
        postId,
        commentId,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to delete comment',
      )
    }
  },
)

export const toggleLikeComment = createAsyncThunk(
  'post/toggleLikeComment',
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const { data } = await postService.toggleCommentLike(commentId)

      return {
        postId,
        commentId,
        liked: data.liked,
        likesCount: data.likesCount,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to like comment',
      )
    }
  },
)

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  posts: [],
  featured: null,
  selectedPost: null,

  comments: {},

  loading: false,
  commentLoading: false,

  hasMore: true,
  page: 1,
  totalPages: 1,

  isError: false,
  errorMessage: '',
}

// ======================================================
// SLICE
// ======================================================
const postSlice = createSlice({
  name: 'post',

  initialState,

  reducers: {
    clearPosts(state) {
      state.posts = []
      state.selectedPost = null
      state.featured = null
      state.page = 1
      state.totalPages = 1
      state.hasMore = true
      state.loading = false
      state.isError = false
      state.errorMessage = ''
    },

    clearSelectedPost(state) {
      state.selectedPost = null
    },
  },

  extraReducers: (builder) => {
    builder
      // ======================================================
      // Fetch Posts
      // ======================================================

      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.isError = false
      })

      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false

        if (action.payload.page === 1) {
          state.posts = action.payload.posts
        } else {
          state.posts.push(...action.payload.posts)
        }

        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.hasMore = action.payload.hasMore
      })

      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.isError = true
        state.errorMessage = action.payload
      })

      // ======================================================
      // Fetch Single Post
      // ======================================================

      .addCase(fetchPost.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPost = action.payload
      })

      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false
        state.isError = true
        state.errorMessage = action.payload
      })

      // ======================================================
      // Create Post
      // ======================================================

      .addCase(createNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
      })

      // ======================================================
      // Update Post
      // ======================================================

      .addCase(updateExistingPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id,
        )

        if (index !== -1) {
          state.posts[index] = action.payload
        }

        if (
          state.selectedPost &&
          state.selectedPost._id === action.payload._id
        ) {
          state.selectedPost = action.payload
        }

        if (state.featured && state.featured._id === action.payload._id) {
          state.featured = action.payload
        }
      })

      // ======================================================
      // Delete Post
      // ======================================================

      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload)

        if (state.selectedPost && state.selectedPost._id === action.payload) {
          state.selectedPost = null
        }

        if (state.featured && state.featured._id === action.payload) {
          state.featured = null
        }
      })

      // ======================================================
      // Toggle Like
      // ======================================================

      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const post = state.posts.find((post) => post._id === action.payload.id)

        if (post) {
          post.isLiked = action.payload.liked
          post.likesCount = action.payload.likesCount
        }

        if (
          state.selectedPost &&
          state.selectedPost._id === action.payload.id
        ) {
          state.selectedPost.isLiked = action.payload.liked
          state.selectedPost.likesCount = action.payload.likesCount
        }

        if (state.featured && state.featured._id === action.payload.id) {
          state.featured.isLiked = action.payload.liked
          state.featured.likesCount = action.payload.likesCount
        }
      })

      // ======================================================
      // Fetch Comments
      // ======================================================

      .addCase(fetchComments.pending, (state) => {
        state.commentLoading = true
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentLoading = false
        state.comments[action.payload.postId] = action.payload.comments
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.commentLoading = false
        state.isError = true
        state.errorMessage = action.payload
      })

      // ======================================================
      // Create Comment
      // ======================================================

      .addCase(createNewComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload

        if (state.comments[postId]) {
          state.comments[postId].unshift(comment)
        } else {
          state.comments[postId] = [comment]
        }
      })

      // ======================================================
      // Delete Comment
      // ======================================================

      .addCase(deleteExistingComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload

        if (state.comments[postId]) {
          state.comments[postId] = state.comments[postId].filter(
            (comment) => comment._id !== commentId,
          )
        }
      })

      // ======================================================
      // Toggle Comment Like
      // ======================================================

      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { postId, commentId, liked, likesCount } = action.payload

        if (state.comments[postId]) {
          const comment = state.comments[postId].find(
            (c) => c._id === commentId,
          )

          if (comment) {
            comment.isLiked = liked
            comment.likesCount = likesCount
          }
        }
      })

      // ======================================================
      // Featured Thought
      // ======================================================

      .addCase(fetchFeaturedThought.pending, (state) => {
        state.loading = true
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

export const { clearPosts, clearSelectedPost } = postSlice.actions

export default postSlice.reducer
