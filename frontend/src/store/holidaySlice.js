import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { holidayService } from "../services/holidayService";

/* =========================================
   FETCH HOLIDAYS
========================================= */

export const fetchHolidays = createAsyncThunk(
  "holiday/fetchHolidays",
  async (_, thunkAPI) => {
    try {
      const response = await holidayService.getHolidays();

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch holidays.",
      );
    }
  },
);

/* =========================================
   CREATE HOLIDAY
========================================= */

export const createHoliday = createAsyncThunk(
  "holiday/createHoliday",
  async (holidayData, thunkAPI) => {
    try {
      const response = await holidayService.createHoliday(holidayData);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create holiday.",
      );
    }
  },
);

/* =========================================
   UPDATE HOLIDAY
========================================= */

export const updateHoliday = createAsyncThunk(
  "holiday/updateHoliday",
  async ({ id, holidayData }, thunkAPI) => {
    try {
      const response = await holidayService.updateHoliday(id, holidayData);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update holiday.",
      );
    }
  },
);

/* =========================================
   DELETE HOLIDAY
========================================= */

export const deleteHoliday = createAsyncThunk(
  "holiday/deleteHoliday",
  async (id, thunkAPI) => {
    try {
      await holidayService.deleteHoliday(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete holiday.",
      );
    }
  },
);

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  holidays: [],
  status: "idle",
  error: null,
  success: false,
};

/* =========================================
   SLICE
========================================= */

const holidaySlice = createSlice({
  name: "holiday",

  initialState,

  reducers: {
    clearHolidayError(state) {
      state.error = null;
    },

    clearHolidaySuccess(state) {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================================
         FETCH HOLIDAYS
      ========================================= */

      .addCase(fetchHolidays.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = false;
      })

      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.success = true;
        state.holidays = action.payload.data;
      })

      .addCase(fetchHolidays.rejected, (state, action) => {
        state.status = "failed";
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         CREATE HOLIDAY
      ========================================= */

      .addCase(createHoliday.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = false;
      })

      .addCase(createHoliday.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.success = true;

        state.holidays.push(action.payload.data);
      })

      .addCase(createHoliday.rejected, (state, action) => {
        state.status = "failed";
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         UPDATE HOLIDAY
      ========================================= */

      .addCase(updateHoliday.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = false;
      })

      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.success = true;

        const updatedHoliday = action.payload.data;

        const index = state.holidays.findIndex(
          (holiday) => holiday._id === updatedHoliday._id,
        );

        if (index !== -1) {
          state.holidays[index] = updatedHoliday;
        }
      })

      .addCase(updateHoliday.rejected, (state, action) => {
        state.status = "failed";
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         DELETE HOLIDAY
      ========================================= */

      .addCase(deleteHoliday.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = false;
      })

      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.success = true;

        state.holidays = state.holidays.filter(
          (holiday) => holiday._id !== action.payload,
        );
      })

      .addCase(deleteHoliday.rejected, (state, action) => {
        state.status = "failed";
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearHolidayError, clearHolidaySuccess } = holidaySlice.actions;

export default holidaySlice.reducer;
