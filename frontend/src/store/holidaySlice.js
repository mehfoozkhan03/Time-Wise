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
   INITIAL STATE
========================================= */

const initialState = {
  holidays: [],
  status: "idle",
  error: null,
};

/* =========================================
   HOLIDAY SLICE
========================================= */

const holidaySlice = createSlice({
  name: "holiday",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================================
         Pending
      ========================================= */

      .addCase(fetchHolidays.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      /* =========================================
         Fulfilled
      ========================================= */

      .addCase(fetchHolidays.fulfilled, (state, action) => {
          console.log("Holiday API Payload:", action.payload);

          state.loading = false;
          state.error = null;
          state.holidays = action.payload;
      })

      /* =========================================
         Rejected
      ========================================= */

      .addCase(fetchHolidays.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default holidaySlice.reducer;
