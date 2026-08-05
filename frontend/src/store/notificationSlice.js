import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifications } from "../services/notificationServices";

// ======================================================
// THUNK
// ======================================================

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const { data } = await getNotifications(page, limit);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch notifications",
      );
    }
  },
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  notifications: [],

  page: 1,
  totalPages: 1,
  hasMore: true,

  loading: false,
  isError: false,
  errorMessage: "",
};

// ======================================================
// SLICE
// ======================================================

const notificationSlice = createSlice({
  name: "notification",

  initialState,

  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);

      // Dropdown me sirf latest 10 notifications rakho
      if (state.notifications.length > 10) {
        state.notifications.pop();
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // ======================================================
      // Fetch Notifications
      // ======================================================

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.isError = false;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload.notifications;

        state.page = action.payload.page;

        state.totalPages = action.payload.totalPages;

        state.hasMore = action.payload.hasMore;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
