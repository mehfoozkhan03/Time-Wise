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
};

/* =========================================
   SLICE
========================================= */

const holidaySlice = createSlice({
  name: "holiday",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================================
         FETCH HOLIDAYS
      ========================================= */

      .addCase(fetchHolidays.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchHolidays.fulfilled, (state, action) => {
        console.log("✅ Holiday API Payload:", action.payload);

        state.status = "succeeded";
        state.error = null;
        state.holidays = action.payload.data;
      })

      .addCase(fetchHolidays.rejected, (state, action) => {
        console.error("❌ Holiday Error:", action.payload);

        state.status = "failed";
        state.error = action.payload;
      })

      /* =========================================
         CREATE HOLIDAY
      ========================================= */

      .addCase(createHoliday.fulfilled, (state, action) => {
        state.holidays.push(action.payload.data);
      })

      /* =========================================
         UPDATE HOLIDAY
      ========================================= */

      .addCase(updateHoliday.fulfilled, (state, action) => {
        const updatedHoliday = action.payload.data;

        const index = state.holidays.findIndex(
          (holiday) => holiday._id === updatedHoliday._id,
        );

        if (index !== -1) {
          state.holidays[index] = updatedHoliday;
        }
      })

      /* =========================================
         DELETE HOLIDAY
      ========================================= */

      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.holidays = state.holidays.filter(
          (holiday) => holiday._id !== action.payload,
        );
      });
  },
});

export default holidaySlice.reducer;