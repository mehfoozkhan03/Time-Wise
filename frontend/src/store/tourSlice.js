import { createSlice } from "@reduxjs/toolkit";

const tourSlice = createSlice({
  name: "tour",
  initialState: {
    isActive: false,
    currentStep: 0,
  },
  reducers: {
    startTour(state) {
      state.isActive = true;
      state.currentStep = 0;
    },
    endTour(state) {
      state.isActive = false;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
  },
});

export const { startTour, endTour, setCurrentStep } = tourSlice.actions;
export default tourSlice.reducer;
