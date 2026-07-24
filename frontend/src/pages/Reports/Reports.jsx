import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./reports.css";
import {
  setSearchLog,
  setStatusFilter,
  setActiveTab,
  setDashboardStats,
  setAttendanceLog,
} from "../../store/reportsSlice";
import { AttendanceLog } from "../../components/Reports/attendanceLog";
import { goals } from "../../components/Reports/goalsData";
import { insights } from "../../components/Reports/insightsData";
import { chartTabs, ranges } from "../../components/Reports/reportsConstants";
import { WorkSummary } from "../../components/Reports/workSummary";
import { PerformanceInsights } from "../../components/Reports/performanceInsights";
import { GoalsSection } from "../../components/Reports/goalsSection";
import { ChartsSection } from "../../components/Reports/chartsSection";
import { sparklineData } from "../../components/Reports/chartData";
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

  console.log(attendanceLog[0]);

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
        />
        {/* ── Two-column: Work Summary + Performance Insights ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <WorkSummary dashboardStats={dashboardStats} />

          <PerformanceInsights insights={insights} />
        </div>

        <ChartsSection
          activeTab={activeTab}
          chartTabs={chartTabs}
          setTab={(tab) => dispatch(setActiveTab(tab))}
        />

        {/* ── Goals & Badges ── */}
        <div
          style={{
            margin: "21px  0",
          }}
        >
          <GoalsSection goals={goals} />
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
