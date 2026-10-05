import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calendarService } from "../services/calendarService";

/* =========================================
   SORT EVENTS
========================================= */

const sortEvents = (events) => {
  events.sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date);

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return (a.startTime || "").localeCompare(b.startTime || "");
  });
};

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
        error.response?.data?.message || "Failed to fetch events."
      );
    }
  }
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
        error.response?.data?.message || "Failed to create event."
      );
    }
  }
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
        error.response?.data?.message || "Failed to update event."
      );
    }
  }
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
        error.response?.data?.message || "Failed to delete event."
      );
    }
  }
);

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  events: [],
  loading: false,
  error: null,
  success: false,
};

/* =========================================
   SLICE
========================================= */

const calendarSlice = createSlice({
  name: "calendar",

  initialState,

  reducers: {
    clearCalendarError(state) {
      state.error = null;
    },

    clearCalendarSuccess(state) {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================================
         FETCH EVENTS
      ========================================= */

      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = action.payload;

        sortEvents(state.events);
      })

      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         CREATE EVENT
      ========================================= */

      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.events.push(action.payload);

        sortEvents(state.events);
      })

      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         UPDATE EVENT
      ========================================= */

      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );

        if (index !== -1) {
          state.events[index] = action.payload;
        }

        sortEvents(state.events);
      })

      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      /* =========================================
         DELETE EVENT
      ========================================= */

      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })

      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearCalendarError, clearCalendarSuccess } =
  calendarSlice.actions;

export default calendarSlice.reducer;