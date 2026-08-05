// import "./CompanyUpdates.css";

// import Card from "../../Card/Card";

// import UpdateCard from "./UpdateCard";

// import {
//   FaBirthdayCake,
//   FaBullhorn,
//   FaTrophy,
//   FaCalendarAlt,
// } from "react-icons/fa";

// export default function CompanyUpdates() {
//   const updates = [
//     {
//       title: "Sarah's Birthday",

//       description: "Wish Sarah from Design Team a wonderful birthday!",

//       time: "Today",

//       icon: <FaBirthdayCake />,

//       color: "#f59e0b",
//     },

//     {
//       title: "Company Announcement",

//       description: "Friday will be Work From Home for all employees.",

//       time: "2 hours ago",

//       icon: <FaBullhorn />,

//       color: "#29A3E0",
//     },

//     {
//       title: "Hackathon Winners",

//       description: "Team Alpha secured first place in the internal hackathon.",

//       time: "Yesterday",

//       icon: <FaTrophy />,

//       color: "#22c55e",
//     },

//     {
//       title: "Sprint Planning",

//       description: "Frontend Sprint Planning starts tomorrow at 10:00 AM.",

//       time: "Tomorrow",

//       icon: <FaCalendarAlt />,

//       color: "#8b5cf6",
//     },
//   ];

//   return (
//     <section className="company_updates" id="tour-company-updates">
//       <h2>Company Updates</h2>

//       <Card>
//         {updates.map((update) => (
//           <UpdateCard key={update.title} {...update} />
//         ))}
//       </Card>
//     </section>
//   );
// }


import "./CompanyUpdates.css";

import Card from "../../Card/Card";

import UpdateCard from "./UpdateCard";
import { useState, useEffect } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

import {
  FaBirthdayCake,
  FaBullhorn,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

export default function CompanyUpdates() {
  const updates = [
    {
      title: "Sarah's Birthday",

      description: "Wish Sarah from Design Team a wonderful birthday!",

      time: "Today",

      icon: <FaBirthdayCake />,

      color: "#f59e0b",
    },

    {
      title: "Company Announcement",

      description: "Friday will be Work From Home for all employees.",

      time: "2 hours ago",

      icon: <FaBullhorn />,

      color: "#29A3E0",
    },

    {
      title: "Hackathon Winners",

      description: "Team Alpha secured first place in the internal hackathon.",

      time: "Yesterday",

      icon: <FaTrophy />,

      color: "#22c55e",
    },

    {
      title: "Sprint Planning",

      description: "Frontend Sprint Planning starts tomorrow at 10:00 AM.",

      time: "Tomorrow",

      icon: <FaCalendarAlt />,

      color: "#8b5cf6",
    },
  ];

    // //skeleton//
    const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

if (showSkeleton) {
  return (
    <section className="company_updates">
      <Skeleton width="220px" height="30px" />

      <Card style={{ marginTop: "20px", padding: "20px" }}>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "16px 0",
              borderBottom:
                item !== 4 ? "1px solid var(--border)" : "none",
            }}
          >
            {/* Icon */}
            <Skeleton width="50px" height="50px" radius="50%" />

            {/* Content */}
            <div style={{ flex: 1 }}>
              <Skeleton width="180px" height="18px" />

              <div style={{ marginTop: "10px" }}>
                <Skeleton width="100%" height="14px" />
              </div>

              <div style={{ marginTop: "8px" }}>
                <Skeleton width="80px" height="12px" />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
// //skeleton//

  return (
    <section className="company_updates" id="tour-company-updates">
      <h2>Company Updates</h2>

      <Card>
        {updates.map((update) => (
          <UpdateCard key={update.title} {...update} />
        ))}
      </Card>
    </section>
  );
}
