import "./CompanyUpdates.css";

import Card from "../../Card/Card";
import UpdateCard from "./UpdateCard";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Skeleton from "../../../components/Skeleton/Skeleton";

import {
  FaBirthdayCake,
  FaBullhorn,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import { useEffect } from "react";
import { fetchEmployeeAnnouncements } from "../../../store/announcementSlice";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CompanyUpdates() {
  const { loading } = useSelector((state) => state.dashboard || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employeeAnnouncements = [], loading: announcementLoading } =
    useSelector((state) => state.announcement || {});

  useEffect(() => {
    dispatch(fetchEmployeeAnnouncements());
  }, [dispatch]);

  const latestAnnouncement = [...employeeAnnouncements].sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt || 0) -
      new Date(a.publishedAt || a.createdAt || 0),
  )[0];

  const updates = [
    {
      title: "Sarah's Birthday",
      description: "Wish Sarah from Design Team a wonderful birthday!",
      time: "Today",
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
      title: "Sprint Planning",
      description: "Frontend Sprint Planning starts tomorrow at 10:00 AM.",
      time: "Tomorrow",
      icon: <FaCalendarAlt />,
      color: "#8b5cf6",
    },
  ];

  // ==========================================
  // BACKEND LOADING SKELETON
  // ==========================================

  if (loading) {
    return (
      <section className="company_updates">
        <Skeleton
          width="220px"
          height="30px"
        />

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
              {/* Icon */}
              <Skeleton
                width="50px"
                height="50px"
                radius="50%"
              />

              {/* Content */}
              <div style={{ flex: 1 }}>
                {/* Title */}
                <Skeleton
                  width="180px"
                  height="18px"
                />

                {/* Description */}
                <div style={{ marginTop: "10px" }}>
                  <Skeleton
                    width="100%"
                    height="14px"
                  />
                </div>

                {/* Time */}
                <div style={{ marginTop: "8px" }}>
                  <Skeleton
                    width="80px"
                    height="12px"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </section>
    );
  }

  return (
    <section
      className="company_updates"
      id="tour-company-updates"
    >
      <h2>Company Updates</h2>

      <Card>
        {updates.map((update) => (
          <UpdateCard
            key={update.title}
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
