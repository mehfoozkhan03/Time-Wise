import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi2";

import "./ProfileSidebar.css";
import { useSelector } from "react-redux";

export const ProfileSidebar = () => {
  const sidebarDetails = useSelector((state) => state.communityProfile.profile);

  const activityData = [
    { day: "J", value: 30 },
    { day: "F", value: 55 },
    { day: "M", value: 68 },
    { day: "A", value: 48 },
    { day: "M", value: 58 },
    { day: "J", value: 74 },
    { day: "J", value: 56 },
    { day: "A", value: 76 },
    { day: "S", value: 58 },
    { day: "O", value: 54 },
    { day: "N", value: 76 },
    { day: "D", value: 60 },
  ];

  const fullName =
    `${sidebarDetails?.firstName || ""} ${sidebarDetails?.lastName || ""}`.trim();

  const joinedDate = sidebarDetails?.createdAt
    ? new Date(sidebarDetails.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "-";

  // sidebar-details data
  const sidebarData = [
    {
      label: "DEPARTMENT",
      post: `${sidebarDetails?.department}`,
    },
    {
      label: "DESIGNATION",
      post: `${sidebarDetails?.designation}`,
    },
    {
      label: "EMAIL",
      post: `${sidebarDetails?.email}`,
    },
    {
      label: "JOINED",
      post: joinedDate,
    },
  ];

  return (
    <aside className="communityProfile-sidebar">
      {/* ================= ABOUT ================= */}

      <section className="communityProfile-sidebar-card">
        <div className="communityProfile-sidebar-heading">
          <div className="communityProfile-sidebar-icon">
            <HiOutlineBriefcase />
          </div>
          <h3>About</h3>
        </div>

        <div className="communityProfile-sidebar-details">
          {sidebarData &&
            sidebarData.map((el, id) => (
              <div
                className="communityProfile-sidebar-detail"
                key={id}
              >
                <span className="communityProfile-sidebar-label">
                  {el.label}
                </span>
                <strong>{el.post}</strong>
              </div>
            ))}
        </div>
      </section>

      {/* ================= COMMUNITY ACTIVITY ================= */}

      <section className="communityProfile-sidebar-card communityProfile-sidebar-card-activity">
        <div className="communityProfile-sidebar-heading">
          <div className="communityProfile-sidebar-icon">
            <HiOutlineChartBar />
          </div>

          <h3>Community Activity</h3>
        </div>

        {/* Activity Summary */}

        <p className="communityProfile-sidebar-summary">
          <strong>24</strong> posts
          <span> • </span>
          <strong>186</strong> likes received
        </p>

        {/* Chart */}

        <div className="communityProfile-activity">
          <div className="communityProfile-activity-bars">
            {activityData.map((item, index) => (
              <div
                className="communityProfile-activity-item"
                key={`${item.day}-${index}`}
              >
                <div className="communityProfile-activity-bar-wrapper">
                  <div
                    className="communityProfile-activity-bar"
                    style={{
                      height: `${item.value}px`,
                    }}
                  />
                </div>

                <span className="communityProfile-activity-day">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* Months */}

          <div className="communityProfile-activity-months">
            <span>Jan</span>
            <span>Dec</span>
          </div>

          {/* Legend */}

          <div className="communityProfile-activity-legend">
            <div className="communityProfile-activity-legend-boxes">
              <span className="communityProfile-activity-legend-box communityProfile-activity-legend-box-low" />

              <span className="communityProfile-activity-legend-box communityProfile-activity-legend-box-medium" />

              <span className="communityProfile-activity-legend-box communityProfile-activity-legend-box-high" />
            </div>

            <span>Low → High activity</span>
          </div>
        </div>
      </section>
    </aside>
  );
};
