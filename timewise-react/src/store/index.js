import { configureStore } from "@reduxjs/toolkit";
import tourReducer from "./tourSlice";

const store = configureStore({
  reducer: {
    tour: tourReducer,
  },
});

export default store;
