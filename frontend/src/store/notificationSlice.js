// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   notifications: [],
// }

// const notificationSlice = createSlice({
//   name: 'notification',

//   initialState,

//   reducers: {
//     setNotifications(state, action) {
//       state.notifications = action.payload
//     },

//     addNotification(state, action) {
//       state.notifications.unshift(action.payload)
//     },

//     removeNotification(state, action) {
//       state.notifications = state.notifications.filter(
//         (item) => item._id !== action.payload,
//       )
//     },

//     clearNotifications(state) {
//       state.notifications = []
//     },
//   },
// })

// export const {
//   setNotifications,
//   addNotification,
//   removeNotification,
//   clearNotifications,
// } = notificationSlice.actions

// export default notificationSlice.reducer


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationService } from "../services/notificationServices";

// ======================================================
// THUNK
// ======================================================

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const { data } = await notificationService.getNotifications();
      return data.notifications;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch notifications"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  notifications: [],
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

  reducers: {},

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
        state.notifications = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default notificationSlice.reducer;