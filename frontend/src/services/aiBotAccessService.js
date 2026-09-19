import api from "./api";

export const aiBotAccessService = {
  getAdminSettings: () => api.get("/user/ai-bot-access"),
  updateAdminSettings: (payload) => api.put("/user/ai-bot-access", payload),
  getMyAccess: () => api.get("/ai/access"),
};
