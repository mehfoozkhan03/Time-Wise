import api from "./api";

// ======================================================
// Get All Notifications
// ======================================================

export const getNotifications = (page = 1, limit = 5) => {
  return api.get("/notifications", {
    params: {
      page,
      limit,
    },
  });
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