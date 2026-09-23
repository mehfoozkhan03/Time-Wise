import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { contactService } from "../services/contactService";

// ================= Create Contact =================

export const createContact = createAsyncThunk(
  "contact/createContact",
  async (contactData, thunkAPI) => {
    try {
      const data = await contactService.createContact(contactData);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message"
      );
    }
  }
);

// ================= Initial State =================

const initialState = {
  contact: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// ================= Contact Slice =================

const contactSlice = createSlice({
  name: "contact",

  initialState,

  reducers: {
    resetContactState(state) {
      state.contact = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Create Contact - Pending =================

      .addCase(createContact.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = "";
      })

      // ================= Create Contact - Fulfilled =================

      .addCase(createContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.contact = action.payload.data;
        state.errorMessage = "";
      })

      // ================= Create Contact - Rejected =================

      .addCase(createContact.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage =
          action.payload || "Failed to send message";
      });
  },
});

export const { resetContactState } = contactSlice.actions;

export default contactSlice.reducer;