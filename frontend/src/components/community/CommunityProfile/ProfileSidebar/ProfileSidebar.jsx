import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi2";

import "./ProfileSidebar.css";
import { useSelector } from "react-redux";

export const ProfileSidebar = () => {
  const sidebarDetails = useSelector((state) => state.communityProfile.profile);

  const {
    userPostsTotal = 0,
    userPostsTotalLikes = 0,
    monthlyActivity = [],
  } = useSelector((state) => state.post);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const activityData = months.map((month, index) => {
    const monthNumber = index + 1;

    const found = monthlyActivity.find(
      (item) => item._id.month === monthNumber,
    );

    return {
      month,
      posts: found?.posts || 0,
    };
  });

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
          <strong>{userPostsTotal}</strong> posts
          <span> • </span>
          <strong>{userPostsTotalLikes}</strong> likes received
        </p>

        {/* Chart */}

        <div className="communityProfile-activity">
          <div className="communityProfile-activity-bars">
            {activityData.map((item, index) => (
              <div
                className="communityProfile-activity-item"
                key={`${item.month}-${index}`}
              >
                <div className="communityProfile-activity-bar-wrapper">
                  <div
                    className="communityProfile-activity-bar"
                    title={`${item.month}: ${item.posts} ${
                      item.posts === 1 ? "post" : "posts"
                    }`}
                    style={{
                      height: `${Math.min(item.posts * 20, 70)}px`,
                    }}
                  />
                </div>

                <span className="communityProfile-activity-day">
                  {item.month.charAt(0)}
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
