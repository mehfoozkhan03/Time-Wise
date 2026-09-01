import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as leaveService from "../services/leaveService";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

const createAdminPagination = () => ({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

export const fetchLeaveBalance = createAsyncThunk(
  "leave/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getLeaveBalance();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch leave balance."),
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
        getErrorMessage(error, "Failed to fetch leave requests."),
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
        getErrorMessage(error, "Failed to submit leave request."),
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
        getErrorMessage(error, "Failed to cancel leave request."),
      );
    }
  },
);

export const fetchAdminLeaves = createAsyncThunk(
  "leave/fetchAdminLeaves",
  async (
    {
      page = 1,
      limit = 10,
      status = "All",
      search = "",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      return await leaveService.getAdminLeaves({
        page,
        limit,
        status,
        search,
      });
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch admin leave requests.",
        ),
      );
    }
  },
);

export const fetchAdminLeaveById = createAsyncThunk(
  "leave/fetchAdminLeaveById",
  async (leaveID, { rejectWithValue }) => {
    try {
      return await leaveService.getAdminLeaveById(leaveID);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch leave details."),
      );
    }
  },
);

export const approveAdminLeave = createAsyncThunk(
  "leave/approveAdminLeave",
  async (leaveID, { rejectWithValue }) => {
    try {
      return await leaveService.approveAdminLeave(leaveID);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to approve leave request.",
        ),
      );
    }
  },
);

export const rejectAdminLeave = createAsyncThunk(
  "leave/rejectAdminLeave",
  async (
    { leaveID, adminComment },
    { rejectWithValue },
  ) => {
    try {
      return await leaveService.rejectAdminLeave(
        leaveID,
        adminComment,
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to reject leave request.",
        ),
      );
    }
  },
);

export const fetchLeaveStatistics = createAsyncThunk(
  "leave/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getAdminLeaveStatistics();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch leave statistics.",
        ),
      );
    }
  },
);

const initialState = {
  balance: null,
  requests: [],

  adminRequests: [],
  adminStatistics: null,
  adminPagination: createAdminPagination(),

  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,

  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },

    resetAdminPagination: (state) => {
      state.adminPagination = createAdminPagination();
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
        state.error =
          action.payload ||
          "Failed to fetch leave balance.";
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
        state.error =
          action.payload ||
          "Failed to fetch leave requests.";
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
        state.error =
          action.payload ||
          "Failed to submit leave request.";
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
        state.error =
          action.payload ||
          "Failed to cancel leave request.";
      })

      .addCase(fetchAdminLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminLeaves.fulfilled, (state, action) => {
        state.loading = false;

        state.adminRequests =
          action.payload?.requests || [];

        state.adminPagination =
          action.payload?.pagination ||
          createAdminPagination();
      })

      .addCase(fetchAdminLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch admin leave requests.";
      })

      .addCase(fetchAdminLeaveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminLeaveById.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(fetchAdminLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch leave details.";
      })

      .addCase(approveAdminLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(approveAdminLeave.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.adminRequests.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.adminRequests[index] = action.payload;
        }
      })

      .addCase(approveAdminLeave.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to approve leave request.";
      })

      .addCase(rejectAdminLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(rejectAdminLeave.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.adminRequests.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.adminRequests[index] = action.payload;
        }
      })

      .addCase(rejectAdminLeave.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to reject leave request.";
      })

      .addCase(fetchLeaveStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLeaveStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStatistics = action.payload;
      })

      .addCase(fetchLeaveStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch leave statistics.";
      });
  },
});

export const {
  clearLeaveError,
  resetAdminPagination,
} = leaveSlice.actions;

export default leaveSlice.reducer;