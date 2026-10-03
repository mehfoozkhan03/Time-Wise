import { getAdminDashboardStats } from "../../services/Admin/adminDashboardHome.service.js";


//# ========================== GET ADMIN DASHBOARD STATS ===========================
export const getAdminDashboardStatsController = async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard stats",
      error: error.message,
    });
  }
};