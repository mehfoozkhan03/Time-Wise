import { configureStore } from "@reduxjs/toolkit";

import tourReducer from "./tourSlice";
import authReducer from "./authSlice";
import attendanceReducer from "./attendanceSlice";
import notificationReducer from "./notificationSlice";
import postReducer from "./postSlice";
import dashboardReducer from "./dashboardSlice";
import reportsReducer from "./reportsSlice";
import adminAuthReducer from "./adminAuthSlice";
import calendarReducer from "./calendarSlice"

const store = configureStore({
  reducer: {
    tour: tourReducer,

    adminAuth: adminAuthReducer,

    auth: authReducer,

    attendance: attendanceReducer,

    notification: notificationReducer,

    post: postReducer,

    dashboard: dashboardReducer,

    reports: reportsReducer,
    
    calendar: calendarReducer, 
  },
});

store.subscribe(() => {
  const { hasSeenTour } = store.getState().tour;
  localStorage.setItem("tw_tour_seen", JSON.stringify(hasSeenTour));
});

export default store;
