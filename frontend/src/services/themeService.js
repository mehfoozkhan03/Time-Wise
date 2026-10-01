import api from "./api";

export const updateTheme = async (theme) => {
  const response = await api.patch(
    "/user/theme",
    { theme }
  );

  return response.data;
};

export const getTheme = async () => {
  const response = await api.get("/user/theme");
  return response.data;
};