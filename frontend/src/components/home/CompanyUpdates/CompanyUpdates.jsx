
import "./CompanyUpdates.css";

import Card from "../../Card/Card";
import UpdateCard from "./UpdateCard";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Skeleton from "../../../components/Skeleton/Skeleton";

import {
  FaBirthdayCake,
  FaBullhorn,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

import { fetchEmployeeAnnouncements } from "../../../store/announcementSlice";
import {
  fetchEvents,
  fetchBirthdayAnnouncements,
} from "../../../store/calendarSlice";
import { fetchHolidays } from "../../../store/holidaySlice";

import { mapHolidayList } from "../../../utils/holidayMapper";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const EVENT_TYPES = [
  "WORK_EVENT",
  "SPECIAL_EVENT",
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "COMPANY_HOLIDAY",
];

export default function CompanyUpdates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: dashboardLoading } = useSelector(
    (state) => state.dashboard || {},
  );

  const { employeeAnnouncements = [], loading: announcementLoading } =
    useSelector((state) => state.announcement || {});

  const {
    events = [],
    loading: calendarLoading,
    birthdayAnnouncements = [],
    birthdayAnnouncementsLoading = false,
  } = useSelector((state) => state.calendar || {});

  const { holidays = [], status: holidayStatus } = useSelector(
    (state) => state.holiday || {},
  );

  const isAdmin = useSelector((state) => state.adminAuth?.isAuthenticated);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    dispatch(fetchEmployeeAnnouncements());
    dispatch(fetchEvents({ authType: isAdmin ? "admin" : "user" }));
    dispatch(fetchHolidays());

    if (!isAdmin) {
      dispatch(fetchBirthdayAnnouncements());
    }
  }, [dispatch, isAdmin]);

  // ==========================================
  // ANNOUNCEMENT
  // ==========================================

  const latestAnnouncement = [...employeeAnnouncements].sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt || 0) -
      new Date(a.publishedAt || a.createdAt || 0),
  )[0];

  // ==========================================
  // CALENDAR EVENTS + HOLIDAYS
  // ==========================================

  const holidayEvents = mapHolidayList(holidays);

  const allEvents = [
    ...(Array.isArray(events) ? events : []),
    ...(Array.isArray(holidayEvents) ? holidayEvents : []),
  ];

  // ==========================================
  // EMPLOYEE BIRTHDAYS
  // ==========================================

  const birthdaySource = isAdmin ? events : birthdayAnnouncements;

  const today = dayjs();

  const birthdayEvents = birthdaySource.filter((event) => {
    if (event.type && event.type.toUpperCase() !== "BIRTHDAY") {
      return false;
    }

    if (!event.date) {
      return false;
    }

    const birthdayDate = dayjs(event.date);

    return (
      birthdayDate.isValid() &&
      birthdayDate.date() === today.date() &&
      birthdayDate.month() === today.month() &&
      birthdayDate.year() === today.year()
    );
  });

  const birthdayNames = birthdayEvents
    .map((event) => event.employeeName || event.title)
    .filter(Boolean);

  const birthdayUpdate = (() => {
    if (birthdayEvents.length === 0) {
      return {
        title: "Employee Birthdays",
        description: "No employee birthdays today. Stay tuned for upcoming celebrations!",
        time: "Today",
      };
    }

    if (birthdayEvents.length === 1) {
      const name = birthdayNames[0] || "Our Employee";

      return {
        title: `${name}'s Birthday`,
        description: `Join us in wishing ${name} a wonderful birthday! 🎂`,
        time: "Today",
      };
    }

    return {
      title: `${birthdayEvents.length} Employee Birthdays`,
      description:
        birthdayNames.length > 0
          ? `Let's celebrate ${birthdayNames.join(", ")} and make their birthdays special! 🎂`
          : "Let's celebrate our colleagues' birthdays today! 🎂",
      time: "Today",
    };
  })();

  // ==========================================
  // UPCOMING EVENTS
  // ==========================================

  const upcomingToday = dayjs().startOf("day");

  const upcomingEvent = allEvents
    .filter((event) => {
      if (!event.date || !EVENT_TYPES.includes(event.type?.toUpperCase())) {
        return false;
      }

      return (
        dayjs(event.date).isValid() &&
        !dayjs(event.date).isBefore(upcomingToday, "day")
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const upcomingUpdate = upcomingEvent
    ? {
        title: upcomingEvent.title || "Upcoming Event",
        description:
          upcomingEvent.description || "An upcoming company event or holiday.",
        time: dayjs(upcomingEvent.date).format("DD MMM"),
      }
    : {
        title: "Upcoming Events",
        description: "No upcoming company events or holidays.",
        time: "No upcoming events",
      };

  // ==========================================
  // COMPANY UPDATES
  // ==========================================

  const updates = [
    {
      ...birthdayUpdate,
      icon: <FaBirthdayCake />,
      color: "#f59e0b",
    },
    {
      title: latestAnnouncement?.title || "Company Announcement",
      description:
        latestAnnouncement?.description || "No announcements available.",
      time: latestAnnouncement
        ? dayjs(
            latestAnnouncement.publishedAt || latestAnnouncement.createdAt,
          ).fromNow()
        : "No announcements yet",
      icon: <FaBullhorn />,
      color: "#29A3E0",
      isAnnouncement: true,
    },
    {
      title: "Hackathon Winners",
      description: "Team Alpha secured first place in the internal hackathon.",
      time: "Yesterday",
      icon: <FaTrophy />,
      color: "#22c55e",
    },
    {
      ...upcomingUpdate,
      icon: <FaCalendarAlt />,
      color: "#8b5cf6",
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  const isLoading =
    dashboardLoading ||
    announcementLoading ||
    calendarLoading ||
    (!isAdmin && birthdayAnnouncementsLoading) ||
    holidayStatus === "loading";

  if (isLoading) {
    return (
      <section className="company_updates">
        <Skeleton width="220px" height="30px" />

        <Card
          style={{
            marginTop: "20px",
            padding: "20px",
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "16px 0",
                borderBottom: item !== 4 ? "1px solid var(--border)" : "none",
              }}
            >
              <Skeleton width="50px" height="50px" radius="50%" />

              <div style={{ flex: 1 }}>
                <Skeleton width="180px" height="18px" />

                <div style={{ marginTop: "10px" }}>
                  <Skeleton width="100%" height="14px" />
                </div>

                <div style={{ marginTop: "8px" }}>
                  <Skeleton width="80px" height="12px" />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </section>
    );
  }

  return (
    <section className="company_updates" id="tour-company-updates">
      <h2>Company Updates</h2>

      <Card>
        {updates.map((update, index) => (
          <UpdateCard
            key={
              update.isAnnouncement
                ? "company-announcement"
                : `company-update-${index}`
            }
            {...update}
            onClick={
              update.isAnnouncement
                ? () => navigate("/announcements")
                : undefined
            }
          />
        ))}
      </Card>
    </section>
  );
}
