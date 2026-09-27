import "./DashboardAnnouncement.css";

import { FaPlus } from "react-icons/fa";
import { AnnouncementStats } from "./AnnouncementStats/AnnouncementStats";
import { AnnouncementFilter } from "./AnnouncementFilter/AnnouncementFilter";
import { AnnouncementCard } from "./AnnouncementList/AnnouncementCard/AnnouncementCard";
import { AnnouncementForm } from "./AnnouncementForm/AnnouncementForm";
import { useState } from "react";
import { fetchAnnouncements } from "../../../store/announcementSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

export const DashboardAnnouncement = () => {
  const { announcements, loading, error } = useSelector(
    (state) => state.announcement,
  );

  const dispatch = useDispatch();

  const [openAnnouncement, setOpenAnnouncement] = useState(false);

   // Fetch announcements
  useEffect(() => {
    dispatch(
      fetchAnnouncements({
        page: 1,
        limit: 10,
        sort: "newest",
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="dashboardAnnouncement-container">
        <div className="dashboardAnnouncement-header">
          <div className="dashboardAnnouncement-heading">
            <h3>Company Announcements</h3>
            <span>Manage company-wide communications and events</span>
          </div>
          <div
            className="dashboardAnnouncement-new"
            onClick={() => setOpenAnnouncement(true)}
          >
            <FaPlus style={{ color: "#42a47f" }} />
            <span>New Announcement</span>
          </div>

          {openAnnouncement && (
            <AnnouncementForm onClose={() => setOpenAnnouncement(false)} />
          )}
        </div>
        <AnnouncementStats />
        <AnnouncementFilter />
        {/* <AnnouncementCard /> */}

        {/* ================= ANNOUNCEMENTS ================= */}

        {loading ? (
          <div className="announcement-loading">
            Loading announcements...
          </div>
        ) : error ? (
          <div className="announcement-error">
            {error}
          </div>
        ) : (
          <AnnouncementCard
            announcements={announcements}
          />
        )}
      </div>
    </>
  );
};
