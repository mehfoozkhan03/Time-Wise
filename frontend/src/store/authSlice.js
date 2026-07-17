import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// ================= Fetch Logged In User =================

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.getCurrentUser();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to fetch user',
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await authService.login(credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login Failed',
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const { data } = await authService.signup(userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration Failed',
      );
    }
  },
);

const initialState = {
  isAuthenticated: document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('token=')),

  user: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.errorMessage = '';
      state.isError = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // ================= Current User =================

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
/*
deepakyadav786@gmail.com
Deeoakyadav@123
*/
