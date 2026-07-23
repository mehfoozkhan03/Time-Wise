import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// ================= Fetch Logged In User =================

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.getCurrentUser();

      const cookiesVal = document.cookie
        .split('; ')
        .some((cookie) => cookie.startsWith('token='));
      console.log(`🚀 ~ cookiesVal:`, cookiesVal);

      return { data: data.user, cookies: cookiesVal };
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

// Theme
export const updateTheme = createAsyncThunk(
  'auth/updateTheme',
  async (theme, thunkAPI) => {
    try {
      const { data } = await authService.updateTheme(theme);
      return data.theme;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update theme',
      );
    }
  },
);

const initialState = {
  isAuthenticated: null,
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
        state.user = action.payload.data;
        state.isAuthenticated = action.payload.cookies;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      .addCase(updateTheme.fulfilled, (state, action) => {
        if (state.user) {
          state.user.theme = action.payload;
        }
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

/*
deepakyadav786@gmail.com
Deeoakyadav@123
*/
