import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminThoughtService } from "../services/adminThoughtService";

export const createAdminThought = createAsyncThunk(
    "adminThought/createAdminThought",
    async (formData, thunkAPI) => {
        try {
            const response =
                await adminThoughtService.createAdminThought(formData);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create thought"
            );
        }
    }
);


const initialState = {
    createdThought: null,
    isCreating: false,
    error: null,
};

const adminThoughtSlice = createSlice({
    name: "adminThought",
    initialState,
    reducers: {
        clearThoughtError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAdminThought.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createAdminThought.fulfilled, (state, action) => {
                state.isCreating = false;
                state.createdThought = action.payload;
            })
            .addCase(createAdminThought.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload;
            });
    },
});

export const { clearThoughtError } = adminThoughtSlice.actions;

export default adminThoughtSlice.reducer;