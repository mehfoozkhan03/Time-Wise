import { attendanceModel } from "../models/Attendance.model.js";
import { userModel } from "../models/User.model.js";


//# ================= Recent Employees =================
export const getRecentEmployees = async (req, res) => {
  try {
    // Today's date range
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all employees
    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 });

    // Get today's attendance
    const attendanceRecords = await attendanceModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Add attendance status to every employee
    const employeesWithStatus = users.map((user) => {
      const attendance = attendanceRecords.find(
        (record) => record.user.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        attendanceStatus: attendance?.checkInTime ? "Present" : "Absent",
      };
    });

    // Present first, then Absent
    // Within each group, newest employee first
    employeesWithStatus.sort((a, b) => {
      if (
        a.attendanceStatus === "Present" &&
        b.attendanceStatus === "Absent"
      ) {
        return -1;
      }

      if (
        a.attendanceStatus === "Absent" &&
        b.attendanceStatus === "Present"
      ) {
        return 1;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Only latest 4 for dashboard
    const recentEmployees = employeesWithStatus.slice(0, 4);

    return res.status(200).json({
      success: true,
      message: "Recent employees fetched successfully",
      employees: recentEmployees,
    });
  } catch (error) {
    console.error("Get Recent Employees Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent employees",
    });
  }
};