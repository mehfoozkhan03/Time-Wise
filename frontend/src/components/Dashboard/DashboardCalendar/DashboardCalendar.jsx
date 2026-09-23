import React from "react";
import EventCalendar from "../../EventCalendar/EventCalendar";
import "./DashboardCalendar.css";

const DashboardCalendar = () => {
  return (
    <div className="dashboardCalendar">
      <EventCalendar />
    </div>
  );
};

export default DashboardCalendar;