import { getAdminAttendanceTrend, getAdminDepartmentHeadcount, getAdminWeeklyAttendance } from "../../services/Admin/adminReport.service.js";

// =====================================================
// WEEKLY ATTENDANCE
// =====================================================

export const getAdminWeeklyAttendanceReport = async (req, res) => {
  try {
    const data = await getAdminWeeklyAttendance();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Admin weekly attendance report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly attendance report",
    });
  }
};

// =====================================================
// DEPARTMENT HEADCOUNT
// =====================================================

export const getAdminDepartmentHeadcountReport = async (req, res) => {
  try {
    const data = await getAdminDepartmentHeadcount();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Admin department report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department headcount",
    });
  }
};

// =====================================================
// ATTENDANCE TREND
// =====================================================

export const getAdminAttendanceTrendReport = async (req, res) => {
  try {
    const data = await getAdminAttendanceTrend();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Admin attendance trend report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance trend",
    });
  }
};