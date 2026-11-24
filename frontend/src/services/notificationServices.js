import api from "./api";

// ================== Get All Notifications ===================

export const getNotifications = (params) => {
  return api.get("/notifications", { params });
};

// ==================== Mark Notification As Read ====================

export const markNotificationAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};

// ===================== Delete Notification =======================

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};


// ================= Mark All Notifications As Read =================
export const markAllNotificationsAsRead = () => {
  return api.patch("/notifications/read-all");
};