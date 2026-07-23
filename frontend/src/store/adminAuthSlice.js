import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adminAuthService } from '../services/adminAuthService';

// ================= Fetch Logged In Admin =================

/* export const fetchCurrentAdmin = createAsyncThunk(
  "adminAuth/fetchCurrentAdmin",
  async (_, thunkAPI) => {
    try {
      const { data } = await adminAuthService.getCurrentAdmin();
      return data.admin;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch admin"
      );
    }
  }
);
 */
// ================= Login =================

export const loginAdmin = createAsyncThunk(
  'adminAuth/loginAdmin',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await adminAuthService.login(credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Admin Login Failed',
      );
    }
  },
);

const initialState = {
  isAuthenticated: document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('adminToken=')),

  admin: null,

  isLoading: false,

  isError: false,

  errorMessage: '',
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',

  initialState,

  reducers: {
    adminLogout(state) {
      state.admin = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = '';
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================

      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.isError = true;
        state.errorMessage = action.payload;
      });

    // ================= Current Admin =================

    /*     .addCase(fetchCurrentAdmin.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(fetchCurrentAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
 */
  },
});

export const { adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
