import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  updateTheme as updateThemeApi,
  getTheme as getThemeApi,
} from "./../services/themeService";

//# ================= Getting theme from backend ================= 
export const getTheme = createAsyncThunk(
  "theme/getTheme",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getThemeApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load theme",
      );
    }
  },
);

//# =================== Update theme in backend ===================
export const updateTheme = createAsyncThunk(
  "theme/updateTheme",

  async (theme, { rejectWithValue }) => {
    try {
      const data = await updateThemeApi(theme);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update theme",
      );
    }
  },
);


const themeSlice = createSlice({
  name: "theme",

  initialState: {
    theme: "system",
    loading: false,
    error: null,
  },

  reducers: {
    // Used when loading the saved theme from the logged-in user
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      //# Updating theme started
      .addCase(updateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //# Theme successfully updated
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.theme = action.payload.theme;
      })

      //# Theme update failed
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //# Getting theme
      .addCase(getTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.theme = action.payload.theme;
      })

      .addCase(getTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
