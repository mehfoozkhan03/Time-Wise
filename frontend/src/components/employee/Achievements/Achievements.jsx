import "./Achievements.css";

import { GiAchievement } from "react-icons/gi";
import { FaStar } from "react-icons/fa6";
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";

export const Achievements = () => {
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

  return (
    <>
      <section className="achievement-section">
        <div className="achievement-header">
          <div><GiAchievement style={{color: "#63abcc"}} /></div>
          <h3>Achievements</h3>
        </div>

        {achievmentsItem.map((item, i) => (
          <div className="achievement-list-container">
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
      </section>
    </>
  );
};
