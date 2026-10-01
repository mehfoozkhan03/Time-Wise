import api from "./api";

// Get admin theme
export const getAdminTheme = async () => {
  const response = await api.get("/admin/theme");
  return response.data;
};

// Update admin theme
export const updateAdminTheme = async (theme) => {
  const response = await api.patch("/admin/theme", {
    theme,
  });

  return response.data;
};