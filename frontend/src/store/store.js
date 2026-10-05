import { configureStore } from "@reduxjs/toolkit";

import tourReducer from "./tourSlice";
import authReducer from "./authSlice";
import attendanceReducer from "./attendanceSlice";
import leaveReducer from "./leaveSlice";
import notificationReducer from "./notificationSlice";
import postReducer from "./postSlice";
import dashboardReducer from "./dashboardSlice";
import reportsReducer from "./reportsSlice";
import adminAuthReducer from "./adminAuthSlice";
import calendarReducer from "./calendarSlice";
import holidayReducer from "./holidaySlice";
import communityProfileReducer from "./communityProfileSlice";
import contactReducer from "./contactSlice";
import { announcementReducer } from "./announcementSlice";
import { themeReducer } from "./themeSlice";
import adminDashboardHomeSlice from "./adminDashboardHomeSlice";
import { adminThemeReducer } from "./adminThemeSlice";
import adminReportReducer from "./adminReportSlice";

const store = configureStore({
  reducer: {
    tour: tourReducer,

    adminAuth: adminAuthReducer,

    auth: authReducer,

    attendance: attendanceReducer,

    leave: leaveReducer,

    notification: notificationReducer,

    post: postReducer,

    dashboard: dashboardReducer,

    reports: reportsReducer,

    calendar: calendarReducer,

    holiday: holidayReducer,

    communityProfile: communityProfileReducer,

    contact: contactReducer,

    announcement: announcementReducer,

    theme: themeReducer,

    adminDashboardHome: adminDashboardHomeSlice,

    adminTheme: adminThemeReducer,

    adminReport: adminReportReducer,
  },
});

export default store;
