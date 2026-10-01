import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAdminTheme as getAdminThemeApi,
  updateAdminTheme as updateAdminThemeApi,
} from "../services/AdminThemeService";

// ================= GET ADMIN THEME =================

export const getAdminTheme = createAsyncThunk(
  "adminTheme/getAdminTheme",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAdminThemeApi();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load admin theme",
      );
    }
  },
);

// ================= UPDATE ADMIN THEME =================

export const updateAdminTheme = createAsyncThunk(
  "adminTheme/updateAdminTheme",
  async (theme, { rejectWithValue }) => {
    try {
      const data = await updateAdminThemeApi(theme);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin theme",
      );
    }
  },
);

// ================= SLICE =================

const adminThemeSlice = createSlice({
  name: "adminTheme",

  initialState: {
    theme: "system",
    loading: false,
    error: null,
  },

  reducers: {
    setAdminTheme: (state, action) => {
      state.theme = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getAdminTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAdminTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.theme = action.payload.theme;
      })

      .addCase(getAdminTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAdminTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateAdminTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.theme = action.payload.theme;
      })

      .addCase(updateAdminTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAdminTheme } = adminThemeSlice.actions;

export const adminThemeReducer = adminThemeSlice.reducer;
