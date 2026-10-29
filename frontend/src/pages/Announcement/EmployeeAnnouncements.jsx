import "./EmployeeAnnouncements.css";
import { fetchEmployeeAnnouncements } from "../../store/announcementSlice";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const EmployeeAnnouncements = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const announcementId = location.state?.announcementId;

  const {
    employeeAnnouncements = [],
    loading,
    error,
  } = useSelector((state) => state.announcement);

  //# Fetch announcements
  useEffect(() => {
    dispatch(fetchEmployeeAnnouncements());
  }, [dispatch]);

  //# Scroll to the announcement opened from a notification
  useEffect(() => {
    if (!announcementId || employeeAnnouncements.length === 0) return;

    const target = document.getElementById(`announcement-${announcementId}`);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [announcementId, employeeAnnouncements]);

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="employee-announcements-page">
      <div className="employee-announcements-header">
        <div>
          <h2>Announcements</h2>
          <p>Stay updated with the latest company announcements.</p>
        </div>

        <span className="announcement-count">
          {employeeAnnouncements.length} Announcements
        </span>
      </div>

      {employeeAnnouncements.length === 0 ? (
        <div className="announcement-empty-state">
          <h3>No announcements yet</h3>
          <p>New company announcements will appear here.</p>
        </div>
      ) : (
        <div className="employee-announcements-list">
          {employeeAnnouncements.map((announcement) => (
            <article
              key={announcement._id}
              id={`announcement-${announcement._id}`}
              className={`employee-announcement-item ${
                announcement._id === announcementId ? "highlighted" : ""
              }`}
            >
              <div className="announcement-card-top">
                <div className="announcement-labels">
                  {announcement.isPinned && (
                    <span className="announcement-pinned">📌 Pinned</span>
                  )}

                  {announcement.category && (
                    <span className="announcement-category">
                      {announcement.category}
                    </span>
                  )}
                </div>

                {announcement.priority && (
                  <span
                    className={`announcement-priority priority-${announcement.priority.toLowerCase()}`}
                  >
                    {announcement.priority} Priority
                  </span>
                )}
              </div>

              <h3>{announcement.title}</h3>

              <p className="announcement-description">
                {announcement.description}
              </p>

              <div className="announcement-card-footer">
                <span>
                  Published{" "}
                  {announcement.publishedAt
                    ? new Date(announcement.publishedAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "date unavailable"}
                </span>

                {announcement.expiryDate && (
                  <span>
                    Expires{" "}
                    {new Date(announcement.expiryDate).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
