import { useDispatch } from "react-redux";
import "./AnnouncementCard.css";

import {
  FaThumbtack,
  FaCircleExclamation,
  FaRegCircleCheck,
  FaGlobe,
  FaRegCalendar,
  FaRegUser,
  FaRegClock,
  FaRegPenToSquare,
  FaChartSimple,
  FaRegEye,
  FaRegTrashCan,
  FaRegFilePdf,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa6";
import {
  deleteAnnouncement,
  togglePinAnnouncement,
} from "../../../../../store/announcementSlice";

export const AnnouncementCard = ({ announcements = [], onEdit }) => {
  const dispatch = useDispatch();

  const handleEdit = (announcement) => {
    onEdit(announcement);
  };

  const handlePin = async (announcement) => {
    try {
      await dispatch(togglePinAnnouncement(announcement._id)).unwrap();
    } catch (error) {
      console.error("Pin announcement error:", error);
    }
  };

  const handleStats = (announcement) => {
    console.log("View Stats:", announcement);
  };

  const handlePreview = (announcement) => {
    console.log("Preview:", announcement);
  };

  //# Delete
  const handleDelete = async (announcement) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${announcement.title}"?`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteAnnouncement(announcement._id)).unwrap();
    } catch (error) {
      console.error("Delete announcement error:", error);
    }
  };

  return (
    <div className="announcement-list">
      {announcements.map((announcement) => {
        const {
          _id,
          isPinned,
          category,
          priority,
          status,
          title,
          description,
          audience,
          publishedAt,
          createdBy,
          expiryDate,
          attachments,
          actionButton,
        } = announcement;

        return (
          <article
            className="announcement-card"
            key={announcement._id}
          >
            {/* ================= TOP SECTION ================= */}

            <div className="announcement-top">
              {/* Badges */}
              <div className="announcement-badges">
                {isPinned && (
                  <span className="badge pinned-badge">
                    <FaThumbtack />
                    Pinned
                  </span>
                )}

                {category && (
                  <span className="badge category-badge">{category}</span>
                )}

                {priority && (
                  <span
                    className={`badge priority-badge ${priority.toLowerCase()}`}
                  >
                    <FaCircleExclamation />
                    {priority.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Status */}
              <span className={`announcement-status ${status.toLowerCase()}`}>
                <FaRegCircleCheck />
                {status}
              </span>
            </div>

            {/* ================= CONTENT ================= */}

            <div className="announcement-content">
              <h3>{title}</h3>

              <p>{description}</p>
            </div>

            {/* ================= META ================= */}

            <div className="announcement-meta">
              <span>
                <FaRegCalendar />
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString()
                  : "Not published"}
              </span>

              <span>
                <FaRegUser />
                Posted by{" "}
                {createdBy
                  ? `${createdBy.firstName || ""} ${createdBy.lastName || ""}`.trim()
                  : "Admin"}
              </span>

              <span>
                <FaRegClock />
                {expiryDate
                  ? `Expires ${new Date(expiryDate).toLocaleDateString()}`
                  : "No expiry"}
              </span>
            </div>

            {/* ================= ATTACHMENT ================= */}

            {attachments?.length > 0 && (
              <>
                <div className="announcement-attachment">
                  <div className="attachment-left">
                    <div className="attachment-icon">
                      <FaRegFilePdf />
                    </div>

                    <div className="attachment-info">
                      <span className="attachment-name">
                        {attachments.name}
                      </span>

                      <span className="attachment-size">
                        {attachments.size}
                      </span>
                    </div>
                  </div>

                  <button className="download-button">
                    <FaDownload />
                    Download
                  </button>
                </div>

                {actionButton?.enabled && actionButton?.url && (
                  <button
                    className="view-policy-button"
                    onClick={() => window.open(actionButton.url, "_blank")}
                  >
                    {actionButton.label || "View Details"}
                    <FaArrowRight />
                  </button>
                )}
              </>
            )}

            {/* ================= ACTIONS ================= */}

            <div className="announcement-actions">
              <div className="action-left">
                <button onClick={() => handleEdit(announcement)}>
                  <FaRegPenToSquare />
                  Edit
                </button>

                <button onClick={() => handlePin(announcement)}>
                  <FaThumbtack />
                  {isPinned ? "Unpin" : "Pin"}
                </button>

                <button onClick={() => handleStats(announcement)}>
                  <FaChartSimple />
                  View Stats
                </button>

                <button onClick={() => handlePreview(announcement)}>
                  <FaRegEye />
                  Preview
                </button>
              </div>

              <button
                className="announcement-delete-button"
                onClick={() => handleDelete(announcement)}
              >
                <FaRegTrashCan />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};
