import api from "./api";

export const getAttendanceReport = async ({
  range = "month",
  from,
  to,
  signal,
} = {}) => {
  const { data } = await api.get("/attendance/reports", {
    params: { range, from, to },
    signal,
  });

  return data.data;
};
