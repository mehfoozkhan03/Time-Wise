import api from "./api";

export const getLeaveBalance = async () => {
  const { data } = await api.get("/leave/balance");

  return data.data;
};

export const getMyLeaves = async ({
  page = 1,
  limit = 10,
  status = "All",
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (status && status !== "All") {
    params.status = status;
  }

  const { data } = await api.get("/leave/my", {
    params,
  });

  return {
    requests: data.data,
    pagination: data.pagination,
  };
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
  const { data } = await api.patch(
    `/leave/${leaveID}/cancel`,
  );

  return data.data;
};

export const getAdminLeaves = async ({
  page = 1,
  limit = 10,
  status = "All",
  search = "",
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (status && status !== "All") {
    params.status = status;
  }

  if (search?.trim()) {
    params.search = search.trim();
  }

  const { data } = await api.get("/leave/admin", {
    params,
  });

  return {
    requests: data.data,
    pagination: data.pagination,
  };
};

export const getAdminLeaveById = async (leaveID) => {
  const { data } = await api.get(
    `/leave/admin/${leaveID}`,
  );

  return data.data;
};

export const approveAdminLeave = async (leaveID) => {
  const { data } = await api.patch(
    `/leave/admin/${leaveID}/approve`,
  );

  return data.data;
};

export const rejectAdminLeave = async (
  leaveID,
  adminComment,
) => {
  const { data } = await api.patch(
    `/leave/admin/${leaveID}/reject`,
    {
      adminComment,
    },
  );

  return data.data;
};

export const getAdminLeaveStatistics = async () => {
  const { data } = await api.get(
    "/leave/admin/stats",
  );

  return data.data;
};