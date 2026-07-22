import { configureStore } from '@reduxjs/toolkit'

import tourReducer from './tourSlice'
import authReducer from './authSlice'
import attendanceReducer from './attendanceSlice'
import notificationReducer from './notificationSlice'
import postReducer from './postSlice'
import dashboardReducer from './dashboardSlice'

const store = configureStore({
  reducer: {
    tour: tourReducer,

    auth: authReducer,

    attendance: attendanceReducer,

    notification: notificationReducer,

    post: postReducer,

    dashboard: dashboardReducer,
  },
})

export default store
