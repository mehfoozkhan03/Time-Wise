import { attendanceModel } from "../../models/Attendance.model.js";
import { userModel } from "../../models/User.model.js";


//# ====================== INDIA TIMEZONE HELPERS =============================
const getIndiaDate = (date = new Date()) => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const getStartOfIndiaDay = (date = new Date()) => {
  const indiaDate = getIndiaDate(date);

  return new Date(`${indiaDate}T00:00:00+05:30`);
};

const getEndOfIndiaDay = (date = new Date()) => {
  const indiaDate = getIndiaDate(date);

  return new Date(`${indiaDate}T23:59:59.999+05:30`);
};


//# ======================= ADMIN DASHBOARD STATS ============================
export const getAdminDashboardStats = async () => {
  //# -------------------- 1. TOTAL EMPLOYEES -------------------------
  const totalEmployees = await userModel.countDocuments();

  //# ------------------------ 2. TODAY RANGE -----------------------
  const todayStart = getStartOfIndiaDay();
  const todayEnd = getEndOfIndiaDay();


  //# ------------------------- 3. TODAY'S ATTENDANCE --------------------------
  const todayAttendance = await attendanceModel.find({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });


  //# ---------------------- 4. PRESENT / LATE / ABSENT / BREAK ----------------------------
  const totalPresentToday = todayAttendance.filter(
    (attendance) =>
      attendance.status === "Present" ||
      attendance.status === "Late" ||
      attendance.status === "Half Day"
  ).length;


  const totalLateCheckInsToday = todayAttendance.filter(
    (attendance) => attendance.status === "Late"
  ).length;


  const totalOnBreakToday = todayAttendance.filter(
    (attendance) =>
      attendance.breaks?.some(
        (breakItem) =>
          breakItem.breakStart && !breakItem.breakEnd
      )
  ).length;


  const totalAbsentToday = Math.max(
    totalEmployees - totalPresentToday,
    0
  );


  //# ----------------------- 5. WEEKLY ATTENDANCE CHART --------------------------
  const today = new Date();
  const indiaDay = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(today);

  const dayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const currentDay = dayMap[indiaDay];


  //# Monday of current week
  const monday = new Date(today);
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(monday.getDate() - daysFromMonday);
  const weeklyAttendance = [];
  const labels = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];


  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);

    currentDate.setDate(monday.getDate() + i);

    const dayStart = getStartOfIndiaDay(currentDate);
    const dayEnd = getEndOfIndiaDay(currentDate);


    const dayAttendance = await attendanceModel.find({
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });


    const present = dayAttendance.filter(
      (attendance) =>
        attendance.status === "Present" ||
        attendance.status === "Late" ||
        attendance.status === "Half Day"
    ).length;


    const late = dayAttendance.filter(
      (attendance) => attendance.status === "Late"
    ).length;


    const absent = Math.max(
      totalEmployees - present,
      0
    );


    weeklyAttendance.push({
      day: labels[i],
      present,
      absent,
      late,
    });
  }


  //# --------------------- 6. RETURN ADMIN DASHBOARD DATA ---------------------------
  return {
    totalEmployees,

    totalPresentToday,

    totalAbsentToday,

    totalLateCheckInsToday,

    totalOnBreakToday,

    weeklyAttendanceChart: weeklyAttendance,
  };
};