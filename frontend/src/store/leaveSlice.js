import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as leaveService from "../services/leaveService";

export const fetchLeaveBalance = createAsyncThunk(
  "leave/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getLeaveBalance();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave balance.",
      );
    }
  },
);

export const fetchMyLeaves = createAsyncThunk(
  "leave/fetchLeaves",
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getMyLeaves();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave requests.",
      );
    }
  },
);

export const submitLeave = createAsyncThunk(
  "leave/submit",
  async (payload, { rejectWithValue }) => {
    try {
      return await leaveService.applyLeave(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit leave request.",
      );
    }
  },
);

export const cancelLeaveRequest = createAsyncThunk(
  "leave/cancel",
  async (leaveID, { rejectWithValue }) => {
    try {
      return await leaveService.cancelLeave(leaveID);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel leave request.",
      );
    }
  },
);

const leaveSlice = createSlice({
  name: "leave",

  initialState: {
    balance: null,
    requests: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })

      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave balance.";
      })

      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })

      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave requests.";
      })

      .addCase(submitLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(submitLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })

      .addCase(submitLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit leave request.";
      })

      .addCase(cancelLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(cancelLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.requests.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })

      .addCase(cancelLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel leave request.";
      });
  },
});

export const { clearLeaveError } = leaveSlice.actions;

export default leaveSlice.reducer;
