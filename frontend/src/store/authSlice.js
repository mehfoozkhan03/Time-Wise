import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginStart(state) {
      state.loading = true
    },

    loginSuccess(state) {
      state.loading = false
      state.isAuthenticated = true
    },

    logoutSuccess(state) {
      state.loading = false
      state.isAuthenticated = false
    },

    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload
    },
  },
})

export const { loginStart, loginSuccess, logoutSuccess, setAuthenticated } =
  authSlice.actions

export default authSlice.reducer
