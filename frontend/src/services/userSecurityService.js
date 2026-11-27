import api from "./api";

export const changeOwnPassword = (currentPassword, newPassword) =>
  api.patch("/user/change-password", { currentPassword, newPassword });
