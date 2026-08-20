import "./DashboardThought.css";

import { TiPin } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

export const DashboardThuoght = () => {
  const thoughtData = [
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      thoughtTime: "Design · 2h ago",
      isApprove: "Pending",
    },
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      thoughtTime: "Design · 2h ago",
      isApprove: "Pending",
    },
  ];

  return (
    <>
      <div className="dashboardThoughtManagement-container">
        <div className="dashboardThought-header">
          <h3>Thoughts Management</h3>
          <span>Review, approve, and pin employee thoughts</span>
        </div>

        {/* thought management content */}
        <div className="dashboardThoughtManagement-content-container">
          {thoughtData &&
            thoughtData.map((el, id) => (
              <div className="dashboardThought-content" key={id}>
                <div className="dashboardThought-upper">
                  <div className="thought-user-details">
                    <div className="thought-user-avatar">{el.avatar}</div>
                    <div className="thought-user">
                      <div>
                        <p>{el.name}</p>
                        <span>{el.thoughtTime}</span>
                      </div>
                      <div>
                        <div></div>
                        <span>{el.isApprove}</span>
                      </div>
                    </div>
                  </div>
                  <div className="thought-request">
                    <div className="thought-status">
                      <div>
                        <span>✅ Approve</span>
                      </div>
                      <div>
                        <span>❌ Reject</span>
                      </div>
                    </div>
                    <div className="thought-pin">
                      <div>
                        <TiPin style={{ color: "#d3365b" }} />
                        <span style={{ opacity: "0.7" }}>Pin</span>
                      </div>
                      <div>
                        <MdDelete style={{ color: "#a52b37" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboardThought-lower">
                  <h3>The compounding effect of showing up consistently</h3>
                  <p>
                    Small, daily efforts compound into massive results over
                    months. Whether it's a 1% improvement in code quality, a
                    kinder word to a colleague, or being 5 minutes early — it
                    adds up. Don't underestimate the ordinary day.
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
