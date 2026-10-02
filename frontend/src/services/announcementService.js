import api from "./api";

export const announcementService = {
  // ============================================================
  // CREATE ANNOUNCEMENT
  // ============================================================

  createAnnouncement(data) {
    return api.post("/admin/announcements", data);
  },

  // ============================================================
  // GET ALL ANNOUNCEMENTS
  // ============================================================

  getAllAnnouncements(params = {}) {
    return api.get("/admin/announcements", {
      params,
    });
  },

  // ============================================================
  // GET SINGLE ANNOUNCEMENT
  // ============================================================

  getAnnouncementById(id) {
    return api.get(`/admin/announcements/${id}`);
  },

  // ============================================================
  // UPDATE ANNOUNCEMENT
  // ============================================================

  updateAnnouncement(id, data) {
    return api.put(`/admin/announcements/${id}`, data);
  },

  // ============================================================
  // DELETE ANNOUNCEMENT
  // ============================================================

  deleteAnnouncement(id) {
    return api.delete(`/admin/announcements/${id}`);
  },

  // ============================================================
  // PUBLISH ANNOUNCEMENT
  // ============================================================

  publishAnnouncement(id) {
    return api.patch(`/admin/announcements/${id}/publish`);
  },

  // ============================================================
  // SCHEDULE ANNOUNCEMENT
  // ============================================================

  scheduleAnnouncement(id, scheduledAt) {
    return api.patch(`/admin/announcements/${id}/schedule`, {
      scheduledAt,
    });
  },

  // ============================================================
  // PIN / UNPIN ANNOUNCEMENT
  // ============================================================

  togglePinAnnouncement(id) {
    return api.patch(`/admin/announcements/${id}/pin`);
  },
};