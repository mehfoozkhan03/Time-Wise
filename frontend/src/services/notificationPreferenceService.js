import api from "./api";

export const getNotificationPreferences = () =>
  api.get("/user/notification-preferences");

export const saveNotificationPreferences = (preferences) =>
  api.patch("/user/notification-preferences", { preferences });
