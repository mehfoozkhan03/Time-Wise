import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calendarService } from "../services/calendarService";

/* =========================================
   GET ALL EVENTS
========================================= */

export const fetchEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async (_, thunkAPI) => {
    try {
      const response = await calendarService.getEvents();
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch events.",
      );
    }
  },
);

/* =========================================
   CREATE EVENT
========================================= */

export const createEvent = createAsyncThunk(
  "calendar/createEvent",
  async (eventData, thunkAPI) => {
    try {
      const response = await calendarService.createEvent(eventData);

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create event.",
      );
    }
  },
);

/* =========================================
   UPDATE EVENT
========================================= */

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await calendarService.updateEvent(id, data);

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update event.",
      );
    }
  },
);

/* =========================================
   DELETE EVENT
========================================= */

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (id, thunkAPI) => {
    try {
      await calendarService.deleteEvent(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete event.",
      );
    }
  },
);

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  events: [],
  loading: false,
  error: null,
};

/* =========================================
   SLICE
========================================= */

const calendarSlice = createSlice({
  name: "calendar",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================================
               FETCH EVENTS
            ========================================= */

      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })

      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================================
               CREATE EVENT
            ========================================= */

      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events.push(action.payload);

        state.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      })

      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================================
               UPDATE EVENT
            ========================================= */

      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.events.findIndex(
          (event) => event._id === action.payload._id,
        );

        if (index !== -1) {
          state.events[index] = action.payload;
        }

        state.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      })

      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================================
               DELETE EVENT
            ========================================= */

      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events = state.events.filter(
          (event) => event._id !== action.payload,
        );
      })

      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default calendarSlice.reducer;
