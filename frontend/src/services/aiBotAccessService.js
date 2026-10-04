import api from "./api";

export const aiBotAccessService = {
  getAdminSettings: () => api.get("/admin/ai-bot-access"),
  updateAdminSettings: (payload) => api.put("/admin/ai-bot-access", payload),
  getMyAccess: () => api.get("/ai/access"),
};
