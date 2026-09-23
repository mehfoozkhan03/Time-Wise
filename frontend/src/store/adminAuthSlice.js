import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminAuthService } from "../services/adminAuthService";

//# ================= Admin Login =================

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await adminAuthService.login(credentials);
      return data;
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Admin Login Failed",
      );
    }
  },
);

//# ========================== Fetch all users =========================

export const fetchAllUser = createAsyncThunk(
  "user/getAllUser",
  async (
    { page = 1, department = "All", status = "All", search = "" } = {},
    thunkAPI,
  ) => {
    try {
      const state = thunkAPI.getState();
      const limit = state.auth.limit;

      const response = await adminAuthService.getAllUser(
        page,
        limit,
        search,
        department,
        status,
      );

      return {
        users: response.data.users,
        totalUsers: response.data.totalUsers,
        page: response.data.page,
        limit: response.data.limit,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        title: "Unable to fetch all users",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  },
);

//# ==================== Recent Employee ========================
export const fetchRecentEmployees = createAsyncThunk(
  "auth/fetchRecentEmployees",
  async (_, thunkAPI) => {
    try {
      const response = await adminAuthService.getRecentEmployees();

      return response.data.employees;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent employees",
      );
    }
  },
);

//# ================== Update Employee ===================

export const updateEmployee = createAsyncThunk(
  "user/updateEmployee",
  async ({ userId, employeeData }, thunkAPI) => {
    try {
      const response = await adminAuthService.updateEmployee(
        userId,
        employeeData,
      );

      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        title: "Unable to update employee",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  },
);

//# =================== Update Department ======================
export const updateUserDepartment = createAsyncThunk(
  "user/updateUserDepartment",
  async ({ userId, department }, thunkAPI) => {
    try {
      const response = await adminAuthService.updateUserDepartment(
        userId,
        department,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to update department",
      });
    }
  },
);

//# ================= Update Role ==================
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminAuthService.updateRole(userId, role);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role",
      );
    }
  },
);

//# ================= Update User ================
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    { userId, firstName, lastName, department, designation, role },
    thunkAPI,
  ) => {
    try {
      const response = await adminAuthService.updateUser(userId, {
        firstName,
        lastName,
        department,
        designation,
        role,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user",
      );
    }
  },
);

//# ================= Getting today all attendance ===================
export const fetchTodayAttendance = createAsyncThunk(
  "adminAuth/fetchTodayAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAuthService.getAllTodayAttendance();

      return response.data.attendance;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch today's attendance",
      );
    }
  },
);

const initialState = {
  isAuthenticated: document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("adminToken=")),

  admin: null,

  isLoading: false,

  isError: false,

  errorMessage: "",
  user: null,
  users: [],
  recentEmployees: [],
  totalUsers: 0,

  currentPage: 0,
  limit: 26,
  search: "",

  todayAttendance: [],
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState,

  reducers: {
    adminLogout(state) {
      state.admin = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.users = [];
      state.currentPage = 0;
    },
    loadLessUsers(state) {
      if (state.currentPage > 1) {
        state.users.splice(state.users.length - state.limit);
        state.currentPage -= 1;
      }
    },
    resetUsers(state) {
      state.users = [];
      state.currentPage = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================

      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
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
      })

      // ==================== Get all Users ================
      .addCase(fetchAllUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })

      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        if (action.payload.page === 1) {
          state.users = action.payload.users;
        } else {
          state.users.push(...action.payload.users);
        }

        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.page;
        state.limit = action.payload.limit;
      })

      .addCase(fetchAllUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      //# ================== Recent Employee ==================
      .addCase(fetchRecentEmployees.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(fetchRecentEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.recentEmployees = action.payload;
      })

      .addCase(fetchRecentEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      //# ====================== Update Department =====================
      .addCase(updateUserDepartment.fulfilled, (state, action) => {
        const { userId, department } = action.meta.arg;

        const index = state.users.findIndex((user) => user._id === userId);

        if (index !== -1) {
          state.users[index].department = department;
        }
      })

      .addCase(updateUserDepartment.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })

      //# ============= Update Role ==============
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id,
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      //# ===================== Update User Details ======================
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id,
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;

        state.isError = action.payload;
      })

      //# =================== Getting all today's attendance ===================
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayAttendance = action.payload;
      })

      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { adminLogout, setSearch, loadLessUsers, resetUsers } =
  adminAuthSlice.actions;

export default adminAuthSlice.reducer;
