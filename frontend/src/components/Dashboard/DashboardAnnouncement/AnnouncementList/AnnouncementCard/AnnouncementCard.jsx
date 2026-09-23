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


const announcements = [
  {
    id: 1,
    isPinned: true,
    category: "Policy",
    priority: "Important",
    status: "Published",

    title: "Updated Attendance Policy",

    description:
      "The updated attendance policy will take effect from October 1st. Please review the new working hours, late check-in, and leave guidelines carefully.",

    audience: "Everyone",
    publishedDate: "Sep 20, 2026",
    postedBy: "Admin",
    expiresDate: "Sep 30, 2026",

    attachment: {
      name: "Attendance-Policy.pdf",
      size: "2.4 MB",
    },

    viewLink: "View Policy",
  },

  {
    id: 2,
    isPinned: false,
    category: null,
    priority: "Urgent",
    status: "Published",

    title: "Complete Your Employee Profile",

    description:
      "All employees must complete their digital employee profile by September 30th. Missing information may affect payroll and leave processing.",

    audience: "Everyone",
    publishedDate: "Sep 10, 2026",
    postedBy: "HR Team",
    expiresDate: "Sep 30, 2026",

    attachment: null,
    viewLink: null,
  },
];

export const AnnouncementCard = () => {
  const handleEdit = (announcement) => {
    console.log("Edit:", announcement);
  };

  const handlePin = (announcement) => {
    console.log("Pin:", announcement);
  };

  const handleStats = (announcement) => {
    console.log("View Stats:", announcement);
  };

  const handlePreview = (announcement) => {
    console.log("Preview:", announcement);
  };

  const handleDelete = (announcement) => {
    console.log("Delete:", announcement);
  };

  return (
    <div className="announcement-list">
      {announcements.map((announcement) => {
        const {
          isPinned,
          category,
          priority,
          status,
          title,
          description,
          audience,
          publishedDate,
          postedBy,
          expiresDate,
          attachment,
          viewLink,
        } = announcement;

        return (
          <article
            className="announcement-card"
            key={announcement.id}
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
                  <span className="badge category-badge">
                    {category}
                  </span>
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
              <span
                className={`announcement-status ${status.toLowerCase()}`}
              >
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
                <FaGlobe />
                {audience}
              </span>

              <span>
                <FaRegCalendar />
                {publishedDate}
              </span>

              <span>
                <FaRegUser />
                Posted by {postedBy}
              </span>

              <span>
                <FaRegClock />
                Expires {expiresDate}
              </span>

            </div>

            {/* ================= ATTACHMENT ================= */}

            {attachment && (
              <>
                <div className="announcement-attachment">

                  <div className="attachment-left">

                    <div className="attachment-icon">
                      <FaRegFilePdf />
                    </div>

                    <div className="attachment-info">

                      <span className="attachment-name">
                        {attachment.name}
                      </span>

                      <span className="attachment-size">
                        {attachment.size}
                      </span>

                    </div>

                  </div>

                  <button className="download-button">
                    <FaDownload />
                    Download
                  </button>

                </div>

                {viewLink && (
                  <button className="view-policy-button">
                    {viewLink}
                    <FaArrowRight />
                  </button>
                )}
              </>
            )}

            {/* ================= ACTIONS ================= */}

            <div className="announcement-actions">

              <div className="action-left">

                <button
                  onClick={() => handleEdit(announcement)}
                >
                  <FaRegPenToSquare />
                  Edit
                </button>

                <button
                  onClick={() => handlePin(announcement)}
                >
                  <FaThumbtack />
                  {isPinned ? "Unpin" : "Pin"}
                </button>

                <button
                  onClick={() => handleStats(announcement)}
                >
                  <FaChartSimple />
                  View Stats
                </button>

                <button
                  onClick={() => handlePreview(announcement)}
                >
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