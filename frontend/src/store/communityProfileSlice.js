import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { authService } from '../services/authService'


// ================= Fetch Community Profile =================

export const fetchCommunityProfile = createAsyncThunk(
  'communityProfile/fetchCommunityProfile',

  async (userId, thunkAPI) => {
    try {
      const { data } = await authService.getUserProfile(userId)

      return data.user
    } catch (error) {
      const errorData = error.response?.data

      // Backend structured error
      if (errorData && errorData.title && errorData.message) {
        return thunkAPI.rejectWithValue(errorData)
      }

      // Network error
      if (!error.response) {
        return thunkAPI.rejectWithValue({
          success: false,
          title: 'Network Error',
          message: 'Unable to connect to server',
          reason: 'Please check your internet connection and try again.',
        })
      }

      // Other errors
      return thunkAPI.rejectWithValue({
        success: false,
        title: 'Profile Failed',
        message:
          error.response?.data?.message ||
          'Unable to fetch user profile',
        reason:
          error.response?.data?.reason ||
          'Please try again later.',
      })
    }
  },
)


// ================= Initial State =================

const initialState = {
  profile: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
}


// ================= Slice =================

const communityProfileSlice = createSlice({
  name: 'communityProfile',

  initialState,

  reducers: {
    clearCommunityProfile: (state) => {
      state.profile = null
      state.isLoading = false
      state.isError = false
      state.errorMessage = ''
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Fetch Profile =================

      .addCase(fetchCommunityProfile.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })

      .addCase(fetchCommunityProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        state.isError = false
        state.errorMessage = ''
      })

      .addCase(fetchCommunityProfile.rejected, (state, action) => {
        state.isLoading = false
        state.profile = null
        state.isError = true
        state.errorMessage = action.payload
      })
  },
})


export const {
  clearCommunityProfile,
} = communityProfileSlice.actions


export default communityProfileSlice.reducer