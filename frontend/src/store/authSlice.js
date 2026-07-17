import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../services/authService'

// ================= Fetch Logged In User =================

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.getCurrentUser()
      return data.user
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch user',
      )
    }
  },
)

const initialState = {
  isAuthenticated: document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('token=')),

  user: null,

  isLoading: false,

  isError: false,

  errorMessage: '',
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loading(state) {
      state.isLoading = true
      state.isError = false
    },

    error(state, action) {
      state.isLoading = false
      state.isError = true
      state.errorMessage = action.payload || ''
    },

    loginSuccess(state) {
      state.isLoading = false
      state.isAuthenticated = true
    },

    logoutSuccess(state) {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.isError = true
        state.errorMessage = action.payload
      })
  },
})

export const { loading, error, loginSuccess, logoutSuccess } = authSlice.actions

export default authSlice.reducer
/*
deepakyadav786@gmail.com
Deeoakyadav@123
*/
