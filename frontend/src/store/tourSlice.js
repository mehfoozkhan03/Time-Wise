import { createSlice } from "@reduxjs/toolkit";

const tourSlice = createSlice({
  name: "tour",
  initialState: {
    isActive: false,
    // ← reads from localStorage on first load
    hasSeenTour: JSON.parse(localStorage.getItem("tw_tour_seen") ?? "false"),
    currentStep: 0,
  },
  reducers: {
    startTour(state) {
      state.isActive = true;
      state.currentStep = 0;
    },
    endTour(state) {
      state.isActive = false;
      state.hasSeenTour = true;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
  },
});

export const { startTour, endTour, setCurrentStep } = tourSlice.actions;
export default tourSlice.reducer;
