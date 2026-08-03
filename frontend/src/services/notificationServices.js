import api from "./api";

// ======================================================
// Get All Notifications
// ======================================================

export const getNotifications = () => {
  return api.get("/notifications");
};

// ======================================================
// Mark Notification As Read
// ======================================================

export const markNotificationAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};

// ======================================================
// Delete Notification
// ======================================================

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};