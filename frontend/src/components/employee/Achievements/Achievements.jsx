import "./Achievements.css";

import { GiAchievement } from "react-icons/gi";
import { FaStar } from "react-icons/fa6";
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";

import { useState, useEffect } from "react";
import Skeleton from "../../Skeleton/Skeleton";

export const Achievements = () => {
  // Replace this with your actual achievements loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove this effect when connecting the actual data-loading logic.
    setLoading(false);
  }, []);

  const achievmentsItem = [
    {
      icon: <FaStar />,
      title: "Perfect Attendance",
      value: "Zero absences for 3 consecutive months",
    },
    {
      icon: <MdOutlineLightMode />,
      title: "Early Bird",
      value: "Checked in before 9 AM for 30+ days",
    },
    {
      icon: <FaRegChartBar />,
      title: "Consistent Performer",
      value: "Maintained 90%+ productivity for a quarter",
    },
    {
      icon: <AiOutlineThunderbolt />,
      title: "Productivity Master",
      value: "Ranked top 5% in team output metrics",
    },
  ];

  if (loading) {
    return (
      <section className="achievement-section achievement-skeleton">
        <div className="achievement-header">
          <Skeleton width="30px" height="30px" radius="8px" />
          <Skeleton width="145px" height="22px" />
        </div>

        <div className="achievement-content">
          {[1, 2, 3, 4].map((item) => (
            <div className="achievement-list-container" key={item}>
              <div className="achievements-list">
                <div className="achievements-icons">
                  <Skeleton
                    width="36px"
                    height="36px"
                    radius="8px"
                  />
                </div>

                <div className="achievement-skeleton-text">
                  <Skeleton width="155px" height="17px" />
                  <Skeleton width="220px" height="14px" />
                </div>
              </div>

              <Skeleton width="65px" height="20px" radius="12px" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="achievement-section">
      <div className="achievement-header">
        <div>
          <GiAchievement style={{ color: "#63abcc" }} />
        </div>
        <h3>Achievements</h3>
      </div>

      <div className="achievement-content">
        {achievmentsItem.map((item, i) => (
          <div className="achievement-list-container" key={i}>
            <div className="achievements-list">
              <div className="achievements-icons">{item.icon}</div>

              <div>
                <h3>{item.title}</h3>
                <span>{item.value}</span>
              </div>
            </div>

            <div>Unlocked</div>
          </div>
        ))}
      </div>
    </section>
  );
};
