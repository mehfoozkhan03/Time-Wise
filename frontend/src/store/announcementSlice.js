import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {announcementService} from "../services/announcementService.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  announcements: [],
  selectedAnnouncement: null,

  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalAnnouncements: 0,
    limit: 10,
  },

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
  success: false,
  message: "",
};


// ============================================================
// GET ALL ANNOUNCEMENTS
// ============================================================

export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async (params = {}, thunkAPI) => {
    try {
      const response =
        await announcementService.getAllAnnouncements(params);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch announcements."
      );
    }
  }
);


// ============================================================
// GET SINGLE ANNOUNCEMENT
// ============================================================

export const fetchAnnouncementById = createAsyncThunk(
  "announcement/fetchAnnouncementById",
  async (id, thunkAPI) => {
    try {
      const response =
        await announcementService.getAnnouncementById(id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch announcement."
      );
    }
  }
);


// ============================================================
// CREATE ANNOUNCEMENT
// ============================================================

export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async (data, thunkAPI) => {
    try {
      const response =
        await announcementService.createAnnouncement(data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to create announcement."
      );
    }
  }
);


// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

export const updateAnnouncement = createAsyncThunk(
  "announcement/updateAnnouncement",
  async ({ id, data }, thunkAPI) => {
    try {
      const response =
        await announcementService.updateAnnouncement(id, data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to update announcement."
      );
    }
  }
);


// ============================================================
// DELETE ANNOUNCEMENT
// ============================================================

export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id, thunkAPI) => {
    try {
      const response =
        await announcementService.deleteAnnouncement(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete announcement."
      );
    }
  }
);


// ============================================================
// PUBLISH ANNOUNCEMENT
// ============================================================

export const publishAnnouncement = createAsyncThunk(
  "announcement/publishAnnouncement",
  async (id, thunkAPI) => {
    try {
      const response =
        await announcementService.publishAnnouncement(id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to publish announcement."
      );
    }
  }
);


// ============================================================
// SCHEDULE ANNOUNCEMENT
// ============================================================

export const scheduleAnnouncement = createAsyncThunk(
  "announcement/scheduleAnnouncement",
  async ({ id, scheduledAt }, thunkAPI) => {
    try {
      const response =
        await announcementService.scheduleAnnouncement(
          id,
          scheduledAt
        );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to schedule announcement."
      );
    }
  }
);


// ============================================================
// PIN / UNPIN ANNOUNCEMENT
// ============================================================

export const togglePinAnnouncement = createAsyncThunk(
  "announcement/togglePinAnnouncement",
  async (id, thunkAPI) => {
    try {
      const response =
        await announcementService.togglePinAnnouncement(id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to update announcement pin."
      );
    }
  }
);


// ============================================================
// SLICE
// ============================================================

const announcementSlice = createSlice({
  name: "announcement",

  initialState,

  reducers: {
    clearAnnouncementError: (state) => {
      state.error = null;
    },

    clearAnnouncementSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearSelectedAnnouncement: (state) => {
      state.selectedAnnouncement = null;
    },

    resetAnnouncementState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL
    // ========================================================

    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;

        state.announcements =
          action.payload.announcements || [];

        state.pagination =
          action.payload.pagination || state.pagination;
      })

      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ========================================================
    // FETCH SINGLE
    // ========================================================

    builder
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedAnnouncement =
          action.payload.announcement || null;
      })

      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ========================================================
    // CREATE
    // ========================================================

    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement created successfully.";

        if (action.payload.announcement) {
          state.announcements.unshift(
            action.payload.announcement
          );
        }
      })

      .addCase(createAnnouncement.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.success = false;
      });


    // ========================================================
    // UPDATE
    // ========================================================

    builder
      .addCase(updateAnnouncement.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement updated successfully.";

        const updatedAnnouncement =
          action.payload.announcement;

        if (updatedAnnouncement) {
          const index = state.announcements.findIndex(
            (announcement) =>
              announcement._id === updatedAnnouncement._id
          );

          if (index !== -1) {
            state.announcements[index] =
              updatedAnnouncement;
          }

          if (
            state.selectedAnnouncement?._id ===
            updatedAnnouncement._id
          ) {
            state.selectedAnnouncement =
              updatedAnnouncement;
          }
        }
      })

      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.success = false;
      });


    // ========================================================
    // DELETE
    // ========================================================

    builder
      .addCase(deleteAnnouncement.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement deleted successfully.";

        state.announcements =
          state.announcements.filter(
            (announcement) =>
              announcement._id !== action.payload.id
          );

        if (
          state.selectedAnnouncement?._id ===
          action.payload.id
        ) {
          state.selectedAnnouncement = null;
        }
      })

      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });


    // ========================================================
    // PUBLISH
    // ========================================================

    builder
      .addCase(publishAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(publishAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement published successfully.";

        const publishedAnnouncement =
          action.payload.announcement;

        if (publishedAnnouncement) {
          const index = state.announcements.findIndex(
            (announcement) =>
              announcement._id ===
              publishedAnnouncement._id
          );

          if (index !== -1) {
            state.announcements[index] =
              publishedAnnouncement;
          }
        }
      })

      .addCase(publishAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ========================================================
    // SCHEDULE
    // ========================================================

    builder
      .addCase(scheduleAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(scheduleAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement scheduled successfully.";

        const scheduledAnnouncement =
          action.payload.announcement;

        if (scheduledAnnouncement) {
          const index = state.announcements.findIndex(
            (announcement) =>
              announcement._id ===
              scheduledAnnouncement._id
          );

          if (index !== -1) {
            state.announcements[index] =
              scheduledAnnouncement;
          }
        }
      })

      .addCase(scheduleAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ========================================================
    // PIN / UNPIN
    // ========================================================

    builder
      .addCase(togglePinAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(togglePinAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.message =
          action.payload.message ||
          "Announcement pin updated.";

        const updatedAnnouncement =
          action.payload.announcement;

        if (updatedAnnouncement) {
          const index = state.announcements.findIndex(
            (announcement) =>
              announcement._id ===
              updatedAnnouncement._id
          );

          if (index !== -1) {
            state.announcements[index] =
              updatedAnnouncement;
          }

          if (
            state.selectedAnnouncement?._id ===
            updatedAnnouncement._id
          ) {
            state.selectedAnnouncement =
              updatedAnnouncement;
          }
        }
      })

      .addCase(togglePinAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


// ============================================================
// ACTIONS
// ============================================================

export const {
  clearAnnouncementError,
  clearAnnouncementSuccess,
  clearSelectedAnnouncement,
  resetAnnouncementState,
} = announcementSlice.actions;


// ============================================================
// SELECTORS
// ============================================================

export const selectAnnouncements = (state) =>
  state.announcement.announcements;

export const selectSelectedAnnouncement = (state) =>
  state.announcement.selectedAnnouncement;

export const selectAnnouncementLoading = (state) =>
  state.announcement.loading;

export const selectAnnouncementError = (state) =>
  state.announcement.error;

export const selectAnnouncementSuccess = (state) =>
  state.announcement.success;


// ============================================================
// REDUCER
// ============================================================

export const announcementReducer = announcementSlice.reducer;