import "./DashboardAnnouncement.css";

import { FaPlus } from "react-icons/fa";
import { AnnouncementStats } from "./AnnouncementStats/AnnouncementStats";
import { AnnouncementFilter } from "./AnnouncementFilter/AnnouncementFilter";
import { AnnouncementCard } from "./AnnouncementList/AnnouncementCard/AnnouncementCard";
import { AnnouncementForm } from "./AnnouncementForm/AnnouncementForm";
import { useState } from "react";
import { fetchAnnouncements } from "../../../store/announcementSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const DashboardAnnouncement = () => {
  const dispatch = useDispatch();

  const { announcements, loading, error } = useSelector(
    (state) => state.announcement,
  );

  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  
  //# This is for announcement edit
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  //# Selected category
  const [category, setCategory] = useState("All Categories");

  //# Selected Status
  const [status, setStatus] = useState("All Status");

  //# Selected Priority
  const [priority, setPriority] = useState("All Priorities");

  //# Selected Audiences
  const [audience, setAudience] = useState("All Audiences");

  //# Sorting according to newest
  const [sort, setSort] = useState("Newest First");

  //# Search
  const [search, setSearch] = useState("");

  //# Fetch announcements whenever category changes
  useEffect(() => {
    const params = {
      page: 1,
      limit: 10,
      sort: "newest",
    };

    //# Only send category when a specific category is selected
    if (category !== "All Categories") {
      params.category = category;
    }

    //# Only send status when a specific status is selected
    if (status !== "All Status") {
      params.status = status;
    }

    //# Priority
    if (priority !== "All Priorities") {
      params.priority = priority;
    }

    //# Audience
    if (audience !== "All Audiences") {
      params.audience = audience;
    }

    //# Search
    if (search.trim()) {
      params.search = search.trim();
    }

    //# Sorting according to newest first
    if (sort === "Oldest First") {
      params.sort = "oldest";
    } else if (sort === "A-Z") {
      params.sort = "az";
    } else {
      params.sort = "newest";
    }

    dispatch(fetchAnnouncements(params));
  }, [dispatch, category, status, priority, audience, sort, search]);


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

          {editingAnnouncement && (
            <AnnouncementForm
              mode="edit"
              announcement={editingAnnouncement}
              onClose={() => setEditingAnnouncement(null)}
            />
          )}
        </div>
        <AnnouncementStats />
        <AnnouncementFilter
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          audience={audience}
          setAudience={setAudience}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
        />

        {/* ================= ANNOUNCEMENTS ================= */}

        {loading ? (
          <div className="announcement-loading">Loading announcements...</div>
        ) : error ? (
          <div className="announcement-error">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="announcement-empty">
            No matching announcements found.
          </div>
        ) : (
          <AnnouncementCard
            announcements={announcements}
            onEdit={setEditingAnnouncement}
          />
        )}
      </div>
    </>
  );
};
