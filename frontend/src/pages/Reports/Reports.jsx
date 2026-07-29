import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./reports.css";
import "../../styles/global.css";
import {
  setSearchLog,
  setStatusFilter,
  setActiveTab,
  setDashboardStats,
  setAttendanceLog,
} from "../../store/reportsSlice";
import { AttendanceLog } from "../../components/Reports/attendanceLog";
import { chartTabs, ranges } from "../../components/Reports/reportsConstants";
import { WorkSummary } from "../../components/Reports/workSummary";
import { PerformanceInsights } from "../../components/Reports/performanceInsights";
import { GoalsSection } from "../../components/Reports/goalsSection";
import { ChartsSection } from "../../components/Reports/chartsSection";
import { ReportsHeader } from "../../components/Reports/reportsHeader";
import { KPISection } from "../../components/Reports/kpiSection";
import {
  getAttendanceHistory,
  getDashboardStats,
} from "../../services/reportsService";

// Main App

export function Reports() {
  const dispatch = useDispatch();

  const {
    dateRange,
    searchLog,
    statusFilter,
    activeTab,
    dashboardStats,
    attendanceLog,
  } = useSelector((state) => state.reports);

  // console.log("Dashboard Stats:", dashboardStats);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const stats = await getDashboardStats();
        const history = await getAttendanceHistory();
        dispatch(setDashboardStats(stats));
        dispatch(setAttendanceLog(history));
      } catch (error) {
        console.error(error);
      }
    };

    loadReports();
  }, [dispatch]);

  const formatTime = (time) => {
    if (!time) return "—";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const secondsToHours = (seconds) => {
    return +(seconds / 3600).toFixed(1);
  };

  const secondsToMinutes = (seconds) => {
    return `${Math.floor(seconds / 60)} min`;
  };

  const filteredLog = useMemo(() => {
    return attendanceLog
      .map((item) => {
        const hours = secondsToHours(item.totalWorkingSeconds);

        return {
          date: formatDate(item.date),
          checkin: formatTime(item.checkInTime),
          checkout: formatTime(item.checkOutTime),
          hours,
          breakDuration: secondsToMinutes(item.totalBreakSeconds),
          overtime: Math.max(0, +(hours - 8).toFixed(1)),
          status: item.status,
          notes: item.notes,
        };
      })
      .filter((e) => {
        const matchSearch =
          e.date.toLowerCase().includes(searchLog.toLowerCase()) ||
          e.notes.toLowerCase().includes(searchLog.toLowerCase());

        const matchStatus =
          statusFilter === "all" ||
          e.status.toLowerCase() === statusFilter.toLowerCase();

        return matchSearch && matchStatus;
      });
  }, [attendanceLog, searchLog, statusFilter]);

  const sparklineData = useMemo(() => {
    const history = [...attendanceLog]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // Last 14 records

    return {
      attendance: history.map((item) => {
        switch (item.status) {
          case "Present":
          case "Late":
            return 1;

          case "Half Day":
            return 0.5;

          default:
            return 0;
        }
      }),

      hours: history.map(
        (item) => +(item.totalWorkingSeconds / 3600).toFixed(1),
      ),

      daily: history.map(
        (item) => +(item.totalWorkingSeconds / 3600).toFixed(1),
      ),

      overtime: history.map((item) =>
        Math.max(0, +(item.totalWorkingSeconds / 3600 - 8).toFixed(1)),
      ),

      productivity: history.map((item) =>
        Math.min(
          100,
          Math.round((item.totalWorkingSeconds / (8 * 3600)) * 100),
        ),
      ),

      leaves: (() => {
        let count = 0;

        return history.map((item) => {
          if (item.status === "Leave") count++;
          return count;
        });
      })(),

      checkin: history.map((item) => {
        if (!item.checkInTime) return 0;

        const d = new Date(item.checkInTime);

        return d.getHours() * 60 + d.getMinutes();
      }),

      streak: (() => {
        let streak = 0;

        return history.map((item) => {
          if (item.status === "Present" || item.status === "Late") {
            streak++;
          } else {
            streak = 0;
          }

          return streak;
        });
      })(),
    };
  }, [attendanceLog]);

  const kpiMetrics = useMemo(() => {
    const history = [...attendanceLog].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    if (!history.length) {
      return {
        averageDailyHours: 0,
        overtimeHours: 0,
        leavesTaken: 0,

        attendanceTrend: 0,
        streakTrend: 0,
        monthlyHoursTrend: 0,
        productivityTrend: 0,
        overtimeTrend: 0,
        checkInTrend: 0,
        leaveTrend: 0,
      };
    }

    // Overall KPI values
    const totalHours = history.reduce(
      (sum, item) => sum + item.totalWorkingSeconds / 3600,
      0,
    );

    const averageDailyHours = +(totalHours / history.length).toFixed(1);

    const overtimeHours = +history
      .reduce((sum, item) => {
        const hrs = item.totalWorkingSeconds / 3600;
        return sum + Math.max(0, hrs - 8);
      }, 0)
      .toFixed(1);

    const leavesTaken = history.filter(
      (item) => item.status === "Leave",
    ).length;

    // Last 7 vs Previous 7
    const current = history.slice(-7);
    const previous = history.slice(-14, -7);

    const avg = (arr, fn) =>
      arr.length ? arr.reduce((s, i) => s + fn(i), 0) / arr.length : 0;

    const attendanceCurrent =
      avg(current, (i) =>
        i.status === "Present" || i.status === "Late"
          ? 1
          : i.status === "Half Day"
            ? 0.5
            : 0,
      ) * 100;

    const attendancePrevious =
      avg(previous, (i) =>
        i.status === "Present" || i.status === "Late"
          ? 1
          : i.status === "Half Day"
            ? 0.5
            : 0,
      ) * 100;

    const hoursCurrent = avg(current, (i) => i.totalWorkingSeconds / 3600);

    const hoursPrevious = avg(previous, (i) => i.totalWorkingSeconds / 3600);

    const productivityCurrent = avg(
      current,
      (i) => (i.totalWorkingSeconds / (8 * 3600)) * 100,
    );

    const productivityPrevious = avg(
      previous,
      (i) => (i.totalWorkingSeconds / (8 * 3600)) * 100,
    );

    const overtimeCurrent = current.reduce((sum, i) => {
      const h = i.totalWorkingSeconds / 3600;
      return sum + Math.max(0, h - 8);
    }, 0);

    const overtimePrevious = previous.reduce((sum, i) => {
      const h = i.totalWorkingSeconds / 3600;
      return sum + Math.max(0, h - 8);
    }, 0);

    const checkInCurrent = avg(current, (i) => {
      if (!i.checkInTime) return 0;
      const d = new Date(i.checkInTime);
      return d.getHours() * 60 + d.getMinutes();
    });

    const checkInPrevious = avg(previous, (i) => {
      if (!i.checkInTime) return 0;
      const d = new Date(i.checkInTime);
      return d.getHours() * 60 + d.getMinutes();
    });

    return {
      averageDailyHours,
      overtimeHours,
      leavesTaken,

      attendanceTrend: +(attendanceCurrent - attendancePrevious).toFixed(1),

      streakTrend: dashboardStats.dayStreak,

      monthlyHoursTrend: +(hoursCurrent - hoursPrevious).toFixed(1),

      productivityTrend: +(productivityCurrent - productivityPrevious).toFixed(
        1,
      ),

      overtimeTrend: +(overtimeCurrent - overtimePrevious).toFixed(1),

      checkInTrend: +(checkInPrevious - checkInCurrent).toFixed(0),

      leaveTrend:
        current.filter((i) => i.status === "Leave").length -
        previous.filter((i) => i.status === "Leave").length,
    };
  }, [attendanceLog, dashboardStats]);

  const dynamicInsights = [
    {
      icon: dashboardStats.attendancePercentage >= 90 ? "📈" : "⚠️",
      type: dashboardStats.attendancePercentage >= 90 ? "positive" : "neutral",
      text:
        dashboardStats.attendancePercentage >= 90
          ? `Excellent attendance rate of ${dashboardStats.attendancePercentage}% this month.`
          : `Attendance rate is ${dashboardStats.attendancePercentage}%. Try to improve consistency.`,
    },

    {
      icon: dashboardStats.punctuality >= 90 ? "⏰" : "⚠️",
      type: dashboardStats.punctuality >= 90 ? "positive" : "neutral",
      text:
        dashboardStats.punctuality >= 90
          ? `Outstanding punctuality at ${dashboardStats.punctuality}%.`
          : `Punctuality is ${dashboardStats.punctuality}%. Aim for more on-time check-ins.`,
    },

    {
      icon: dashboardStats.productivity >= 80 ? "🎯" : "📊",
      type: dashboardStats.productivity >= 80 ? "positive" : "neutral",
      text:
        dashboardStats.productivity >= 80
          ? `Excellent productivity score of ${dashboardStats.productivity}%.`
          : `Current productivity is ${dashboardStats.productivity}%. Focus on improving task completion.`,
    },

    {
      icon: dashboardStats.weeklyGoalScore >= 100 ? "🏆" : "💼",
      type: dashboardStats.weeklyGoalScore >= 100 ? "positive" : "neutral",
      text:
        dashboardStats.weeklyGoalScore >= 100
          ? "Congratulations! You've achieved your weekly goal."
          : `${dashboardStats.weeklyHoursRemaining} hours remain to complete this week's goal.`,
    },

    {
      icon: dashboardStats.breakScore >= 90 ? "☕" : "⚠️",
      type: dashboardStats.breakScore >= 90 ? "positive" : "neutral",
      text:
        dashboardStats.breakScore >= 90
          ? `Excellent break management with a score of ${dashboardStats.breakScore}%.`
          : `Break score is ${dashboardStats.breakScore}%. Try to manage breaks more effectively.`,
    },

    {
      icon: "🔥",
      type: "positive",
      text: `You're currently on a ${dashboardStats.dayStreak}-day attendance streak. Your best streak is ${dashboardStats.longestStreak} days.`,
    },
  ];

  return (
    <div
      className="reportsDiv"
      style={{ minHeight: "100vh", paddingBottom: 60 }}
    >
      {/* Ambient gradient background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 40% at 30% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 30% at 80% -5%, rgba(34,211,238,0.06) 0%, transparent 50%)",
        }}
      />

      <div
        style={{
          // maxWidth: 1400,
          margin: "0 15px",
          padding: "0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ReportsHeader dateRange={dateRange} ranges={ranges} />

        <KPISection
          sparklineData={sparklineData}
          dashboardStats={dashboardStats}
          kpiMetrics={kpiMetrics}
        />
        {/* ── Two-column: Work Summary + Performance Insights ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
          className="report_2_div"
        >
          <WorkSummary dashboardStats={dashboardStats} />

          <PerformanceInsights insights={dynamicInsights} />
        </div>
        <ChartsSection
          activeTab={activeTab}
          chartTabs={chartTabs}
          setTab={(tab) => dispatch(setActiveTab(tab))}
          attendanceLog={attendanceLog}
          dashboardStats={dashboardStats}
        />
        {/* ── Goals & Badges ── */}
        <div
          style={{
            margin: "21px  0",
          }}
        >
          <GoalsSection dashboardStats={dashboardStats} />
        </div>
        <AttendanceLog
          attendanceLog={attendanceLog}
          filteredLog={filteredLog}
          searchLog={searchLog}
          statusFilter={statusFilter}
          onSearchChange={(value) => dispatch(setSearchLog(value))}
          onStatusChange={(value) => dispatch(setStatusFilter(value))}
        />
      </div>
    </div>
  );
}
