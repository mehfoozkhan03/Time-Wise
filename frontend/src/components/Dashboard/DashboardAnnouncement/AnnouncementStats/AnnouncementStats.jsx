import { useSelector } from "react-redux";
import { selectAnnouncements } from "../../../../store/announcementSlice";
import "./AnnouncementStats.css";

import {
  FaRegCircleCheck,
  FaRegClock,
  FaRegFileExcel,
  FaTriangleExclamation,
} from "react-icons/fa6";

export const AnnouncementStats = () => {
  const announcements = useSelector(selectAnnouncements);

  const publishedCount = announcements.filter(
    (announcement) => announcement.status === "Published",
  ).length;

  const scheduledCount = announcements.filter(
    (announcement) => announcement.status === "Scheduled",
  ).length;

  const draftCount = announcements.filter(
    (announcement) => announcement.status === "Draft",
  ).length;

  const expiringSoonCount = announcements.filter((announcement) => {
    if (!announcement.expiryDate) return false;

    const today = new Date();
    const expiryDate = new Date(announcement.expiryDate);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    return expiryDate >= today && expiryDate <= sevenDaysLater;
  }).length;

const cardData = [
    {
        icon: <FaRegCircleCheck />,
        count: publishedCount,
        title: "Published",
        subTitle: "Currently active",
        color: "#01bc7d",
    },
    {
        icon: <FaRegClock />,
        count: scheduledCount,
        title: "Scheduled",
        subTitle: "Upcoming announcements",
        color: "#2b7eff",
    },
    {
        icon: <FaRegFileExcel />,
        count: draftCount,
        title: "Drafts",
        subTitle: "Not yet published",
        color: "#99a0af",
    },
    {
        icon: <FaTriangleExclamation />,
        count: expiringSoonCount,
        title: "Expiring Soon",
        subTitle: "Within the next 7 days",
        color: "#ff9800",
    },
];

  return (
    <>
      <section className="announcementStats-section">
        <div className="announementStats-container">
          {cardData &&
            cardData.map((el, id) => (
              <div
                className="announcementStats-card"
                key={id}
              >
                <div
                  className="announcementStats-card-icon"
                  style={{ background: el.color }}
                >
                  {el.icon}
                </div>
                <div className="announcementStats-card-content">
                  <span>{el.count}</span>
                  <span>{el.title}</span>
                  <span>{el.subTitle}</span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};
