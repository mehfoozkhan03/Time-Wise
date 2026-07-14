import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('token='))
    ? true
    : false,
  isLoading: false,
  isError: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loading(state) {
      state.isLoading = true;
      state.isError = false;
    },

    error(state) {
      state.isError = true;
      state.isLoading = false;
    },

    loginSuccess(state, action) {
      const hasToken = document.cookie
        .split('; ')
        .some((cookie) => cookie.startsWith('token='));
      console.log(`🚀 ~ hasToken:`, hasToken);
      state.isLoading = false;
      state.token = hasToken || false;
    },

    logoutSuccess(state) {
      state.isLoading = false;
      state.token = false;
    },

    // setAuthenticated(state, action) {
    //   state.isAuthenticated = action.payload;
    // },
  },
});

export const { loading, loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;

/* 
deepakyadav786@gmail.com
Deeoakyadav@123 
*/
