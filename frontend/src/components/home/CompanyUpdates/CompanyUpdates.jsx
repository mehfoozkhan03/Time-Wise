import "./CompanyUpdates.css";

import Card from "../../Card/Card";

import UpdateCard from "./UpdateCard";

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
