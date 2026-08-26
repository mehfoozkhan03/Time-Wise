import api from "./api";

export const getLeaveBalance = async () => {
  const { data } = await api.get("/leave/balance");

  return data.data;
};

export const getMyLeaves = async () => {
  const { data } = await api.get("/leave/my");

  return data.data;
};

export const getLeaveById = async (leaveID) => {
  const { data } = await api.get(`/leave/${leaveID}`);

  return data.data;
};

export const applyLeave = async (payload) => {
  const { data } = await api.post("/leave", payload);

  return data.data;
};

export const cancelLeave = async (leaveID) => {
  const { data } = await api.patch(`/leave/${leaveID}/cancel`);

  return data.data;
};