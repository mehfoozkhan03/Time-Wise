import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

// ================= Fetch Logged In User =================

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.getCurrentUser();

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        title: "Unable to fetch user",
        message: error.response?.data?.message || "Failed to load user profile",
        reason: error.response?.data?.reason || "Please refresh and try again.",
      });
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

      const response = await authService.getAllUser(
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
      const response = await authService.getRecentEmployees();

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
      const response = await authService.updateEmployee(userId, employeeData);

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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await authService.login(credentials);
      return data;
    } catch (error) {
      // Handle different error scenarios
      const errorData = error.response?.data;

      // If backend sent structured error response
      if (errorData && errorData.title && errorData.message) {
        return thunkAPI.rejectWithValue(errorData);
      }

      // If network error or no response
      if (!error.response) {
        return thunkAPI.rejectWithValue({
          success: false,
          title: "Network Error",
          message: "Unable to connect to server",
          reason: "Please check your internet connection and try again.",
        });
      }

      // For any other error (including 500)
      return thunkAPI.rejectWithValue({
        success: false,
        title: "Login Failed",
        message: error.response.data?.message || "An error occurred",
        reason: error.response.data?.reason || "Please try again later.",
      });
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await authService.signup(userData);
      return data;
    } catch (error) {
      // Handle different error scenarios
      const errorData = error.response?.data;

      // If backend sent structured error response
      if (errorData && errorData.title && errorData.message) {
        return thunkAPI.rejectWithValue(errorData);
      }

      // If network error or no response
      if (!error.response) {
        return thunkAPI.rejectWithValue({
          success: false,
          title: "Network Error",
          message: "Unable to connect to server",
          reason: "Please check your internet connection and try again.",
        });
      }

      // For any other error (including 500)
      return thunkAPI.rejectWithValue({
        success: false,
        title: "Registration Failed",
        message: error.response.data?.message || "An error occurred",
        reason: error.response.data?.reason || "Please try again later.",
      });
    }
  },
);

// Theme
export const updateTheme = createAsyncThunk(
  "auth/updateTheme",
  async (theme, thunkAPI) => {
    try {
      const { data } = await authService.updateTheme(theme);
      return data.theme;
    } catch (error) {
      const errorData = error.response?.data;

      return thunkAPI.rejectWithValue(
        errorData?.message || error.message || "Failed to update theme",
      );
    }
  },
);

//# =================== Update Department ======================
export const updateUserDepartment = createAsyncThunk(
  "user/updateUserDepartment",
  async ({ userId, department }, thunkAPI) => {
    try {
      const response = await authService.updateUserDepartment(
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

//# Update Role
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await authService.updateRole(userId, role);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role",
      );
    }
  },
);

//# Update Employee
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    { userId, firstName, lastName, department, designation, role },
    thunkAPI,
  ) => {
    try {
      const response = await authService.updateUser(userId, {
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

const initialState = {
  isAuthenticated: document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("token=")),
  user: null,
  users: [],
  recentEmployees: [],
  totalUsers: 0,
  isLoading: false,
  isError: false,
  errorMessage: "",
  currentPage: 0,
  limit: 10,
  search: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.errorMessage = "";
      state.isError = false;
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

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
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

      // ================= Register =================

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false; // Don't auto-login
        state.isError = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
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
        state.user = action.payload;
        state.isAuthenticated = document.cookie
          .split("; ")
          .some((cookie) => cookie.startsWith("token="));
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
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

      // ================= Theme Update =================

      .addCase(updateTheme.fulfilled, (state, action) => {
        if (state.user) {
          state.user.theme = action.payload;
        }
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

      //# Update Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id,
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      //# ===================== Update Employee Details ======================
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
      });
  },
});

export const { logout, setSearch, loadLessUsers, resetUsers } =
  authSlice.actions;

export default authSlice.reducer;

/*
deepakyadav786@gmail.com
Deeoakyadav@123
*/
