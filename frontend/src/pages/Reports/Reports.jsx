import { useMemo, useEffect, useState } from "react";
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
import { getAttendanceReport } from "../../services/reportsService";
import { roundHours } from "../../components/Reports/formatHours";

// Main App

export function Reports() {
  const dispatch = useDispatch();

  const {
    dateRange,
    customStartDate,
    customEndDate,
    searchLog,
    statusFilter,
    activeTab,
    dashboardStats,
    attendanceLog,
  } = useSelector((state) => state.reports);

  const [reportCalendar, setReportCalendar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // console.log("Dashboard Stats:", dashboardStats);

  useEffect(() => {
    if (dateRange === "custom" && (!customStartDate || !customEndDate)) {
      setIsLoading(false);
      dispatch(setAttendanceLog([]));
      setReportCalendar([]);
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;
    setIsLoading(true);
    setLoadError("");

    getAttendanceReport({
      range: dateRange,
      from: customStartDate,
      to: customEndDate,
      signal: controller.signal,
    })
      .then((report) => {
        if (cancelled) return;
        dispatch(setDashboardStats(report.stats));
        dispatch(setAttendanceLog(report.attendance));
        setReportCalendar(report.calendar);
      })
      .catch((error) => {
        if (cancelled || error.code === "ERR_CANCELED") return;
        setLoadError(error.response?.data?.message || "Unable to load reports.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [dispatch, dateRange, customStartDate, customEndDate]);

  const formatTime = (time) => {
    if (!time) return "—";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-").map(Number);
      return new Date(year, month - 1, day).toLocaleDateString("en-GB");
    }
    return new Date(date).toLocaleDateString("en-GB");
  };

  const secondsToHours = (seconds) => {
    return roundHours(seconds / 3600);
  };

  const secondsToMinutes = (seconds) => {
    return `${Math.floor((seconds || 0) / 60)} min`;
  };

  const filteredLog = useMemo(() => {
    return attendanceLog
      .map((item) => {
        const hours = secondsToHours(item.totalWorkingSeconds);

        return {
          date: formatDate(item.dateKey || item.date),
          checkin: formatTime(item.checkInTime),
          checkout: formatTime(item.checkOutTime),
          hours,
          breakDuration: secondsToMinutes(item.totalBreakSeconds),
          overtime: roundHours(Math.max(0, (item.totalWorkingSeconds || 0) / 3600 - 8)),
          status: item.status,
          notes: item.notes,
        };
      })
      .filter((e) => {
        const matchSearch =
          e.date.toLowerCase().includes(searchLog.toLowerCase()) ||
          String(e.notes || "").toLowerCase().includes(searchLog.toLowerCase());

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
        (item) => roundHours((item.totalWorkingSeconds || 0) / 3600),
      ),

      daily: history.map(
        (item) => roundHours((item.totalWorkingSeconds || 0) / 3600),
      ),

      overtime: history.map((item) =>
        roundHours(Math.max(0, (item.totalWorkingSeconds || 0) / 3600 - 8)),
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
    const averageDailyHours = dashboardStats.averageDailyHours || 0;
    const overtimeHours = dashboardStats.overtimeHours || 0;
    const leavesTaken = dashboardStats.leavesTaken || 0;

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

    const hoursCurrent = roundHours(avg(current, (i) => i.totalWorkingSeconds / 3600));

    const hoursPrevious = roundHours(avg(previous, (i) => i.totalWorkingSeconds / 3600));

    const productivityCurrent = avg(
      current,
      (i) => (i.totalWorkingSeconds / (8 * 3600)) * 100,
    );

    const productivityPrevious = avg(
      previous,
      (i) => (i.totalWorkingSeconds / (8 * 3600)) * 100,
    );

    const overtimeCurrent = roundHours(current.reduce((sum, i) => {
      const h = i.totalWorkingSeconds / 3600;
      return sum + Math.max(0, h - 8);
    }, 0));

    const overtimePrevious = roundHours(previous.reduce((sum, i) => {
      const h = i.totalWorkingSeconds / 3600;
      return sum + Math.max(0, h - 8);
    }, 0));

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

      monthlyHoursTrend: roundHours(hoursCurrent - hoursPrevious),

      productivityTrend: +(productivityCurrent - productivityPrevious).toFixed(
        1,
      ),

      overtimeTrend: roundHours(overtimeCurrent - overtimePrevious),

      checkInTrend: +(checkInPrevious - checkInCurrent).toFixed(0),

      leaveTrend:
        current.filter((i) => i.status === "Leave").length -
        previous.filter((i) => i.status === "Leave").length,
    };
  }, [attendanceLog, dashboardStats]);

  const rangeLabel = ranges.find((range) => range.id === dateRange)?.label || "Selected range";

  const dynamicInsights = [
    {
      icon: dashboardStats.attendancePercentage >= 90 ? "📈" : "⚠️",
      type: dashboardStats.attendancePercentage >= 90 ? "positive" : "neutral",
      text:
        dashboardStats.attendancePercentage >= 90
          ? `Excellent attendance rate of ${dashboardStats.attendancePercentage}% for ${rangeLabel.toLowerCase()}.`
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
          : `${roundHours(dashboardStats.weeklyHoursRemaining)} hours remain to complete this week's goal.`,
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
        <ReportsHeader
          dateRange={dateRange}
          ranges={ranges}
          isLoading={isLoading}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
        />

        {loadError && (
          <p role="alert" className="reports_error">
            {loadError}
          </p>
        )}

        <KPISection
          sparklineData={sparklineData}
          dashboardStats={dashboardStats}
          kpiMetrics={kpiMetrics}
          isLoading={isLoading}
          rangeLabel={rangeLabel}
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
          <WorkSummary dashboardStats={dashboardStats} isLoading={isLoading} rangeLabel={rangeLabel} />

          <PerformanceInsights insights={dynamicInsights} isLoading={isLoading} />
        </div>
        <ChartsSection
          activeTab={activeTab}
          chartTabs={chartTabs}
          setTab={(tab) => dispatch(setActiveTab(tab))}
          attendanceLog={attendanceLog}
          dashboardStats={dashboardStats}
          calendarData={reportCalendar}
          rangeLabel={rangeLabel}
          isLoading={isLoading}
        />
        {/* ── Goals & Badges ── */}
        <div
          style={{
            margin: "21px  0",
          }}
        >
          <GoalsSection dashboardStats={dashboardStats} isLoading={isLoading} />
        </div>
        <AttendanceLog
          filteredLog={filteredLog}
          searchLog={searchLog}
          statusFilter={statusFilter}
          onSearchChange={(value) => dispatch(setSearchLog(value))}
          onStatusChange={(value) => dispatch(setStatusFilter(value))}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
