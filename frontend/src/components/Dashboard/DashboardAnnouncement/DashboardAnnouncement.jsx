import "./DashboardAnnouncement.css";

import { FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

export const DashboardAnnouncement = () => {
  const cardData = [
    {
      category: "Company",
      date: "July 8. 3:00PM",
      title: "Q2 All-Hands Meeting",
      description:
        "Quarterly all-hands via Zoom. Link will be emailed 30 minutes before the session.",
    },
    {
      category: "Holiday",
      date: "July 4 · Full Day",
      title: "Independence Day Holiday",
      description:
        "Office closed. Skeleton crew on-call. Enjoy the long weekend!",
    },
    {
      category: "Policy",
      date: "Effective Aug 1",
      title: "New Remote Work Policy",
      description:
        "Updated WFH policy: 3 days in-office per week minimum for all non-remote roles.",
    },
    {
      category: "Event",
      date: "July 19 · 4:00 PM",
      title: "Team Building — Escape Room",
      description:
        "Voluntary team outing at Puzzle Break. Register by July 14th to secure a spot.",
    },
  ];

  return (
    <>
      <div className="dashboardAnnouncement-container">
        <div className="dashboardAnnouncement-header">
          <div className="dashboardAnnouncement-heading">
            <h3>Company Announcements</h3>
            <span>Manage company-wide communications and events</span>
          </div>
          <div className="dashboardAnnouncement-new">
            <FaPlus style={{ color: "#42a47f" }} />
            <span>New Announcement</span>
          </div>
        </div>
        <div className="dashboardAnnouncement-content">
          {cardData &&
            cardData.map((el, id) => (
              <div
                className="dashboardAnnouncement-content-card"
                key={id}
              >
                <div className="dashboardAnnouncement-header">
                  <div className="dashboardAnnouncement-category">
                    {el.category}
                  </div>
                  <div className="dashboardAnnouncement-date">{el.date}</div>
                </div>
                <div className="dashboardAnnouncement-title">
                  <h3>{el.title}</h3>
                </div>
                <div className="dashboardAnnouncement-description">
                  <p>{el.description}</p>
                </div>
                <div className="dashboardAnnouncement-actions">
                  <div className="announcement-edit">
                    <MdEdit style={{ color: "#f8845d", fontSize: "14px" }} />
                    <span style={{ color: "#39a4ec", fontSize: "12px" }}>
                      Edit
                    </span>
                  </div>
                  <div className="announcement-delete">
                    <MdDelete style={{ color: "#c44261", fontSize: "14px" }} />
                    <span style={{ color: "#ee4f74", fontSize: "12px" }}>
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
