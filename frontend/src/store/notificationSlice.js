import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
}

const notificationSlice = createSlice({
  name: 'notification',

  initialState,

  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload
    },

    addNotification(state, action) {
      state.notifications.unshift(action.payload)
    },

    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (item) => item._id !== action.payload,
      )
    },

    clearNotifications(state) {
      state.notifications = []
    },
  },
})

export const {
  setNotifications,
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer
