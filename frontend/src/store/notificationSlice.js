import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../services/notificationServices";

// ==================== THUNK ========================

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const { data } = await getNotifications();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch notifications",
      );
    }
  },
);

//# ================ Mark as Read ================== 
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, thunkAPI) => {
    try {
      await markNotificationAsRead(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to mark notification as read"
      );
    }
  }
);


//# ========================= Delete Notification =====================
export const removeNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await deleteNotification(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to delete notification"
      );
    }
  }
);

//# ============== Mark all notification as Read =============== 
export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      await markAllNotificationsAsRead();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Unable to mark all notifications as read"
      );
    }
  }
);



// ================== INITIAL STATE ======================

const initialState = {
  notifications: [],

  loading: false,
  isError: false,
  errorMessage: "",
};

// =============== SLICE ========================

const notificationSlice = createSlice({
  name: "notification",

  initialState,

  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      //# ================= Fetch Notifications ================
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.isError = false;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })


      //# ===================== Mark as Read ================= 
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (item) => item._id === action.payload
        );

        if (notification) {
          notification.read = true;
        }
      })

      //# ================ Delete Notification ================= 
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (item) => item._id !== action.payload
        );
      })


      //# =============== Mark all notification as read =============
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true;
        });
      })


  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
