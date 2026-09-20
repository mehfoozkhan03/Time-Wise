import "./AnnouncementStats.css";

import {
  FaRegCircleCheck,
  FaRegClock,
  FaRegFileExcel,
  FaTriangleExclamation,
} from "react-icons/fa6";

export const AnnouncementStats = () => {

    const cardData = [
        {
            icon: <FaRegCircleCheck />,
            count: 3,
            title: "Published",
            subTitle: "Currently active",
            color: "#01bc7d"
        },
        {
            icon: <FaRegClock />,
            count: 1,
            title: "Scheduled",
            subTitle: "Upcoming announcements",
            color: "#2b7eff"
        },
        {
            icon: <FaRegFileExcel />,
            count: 1,
            title: "Drafts",
            subTitle: "Not yet published",
            color: "#99a0af"
        },
        {
            icon: <FaTriangleExclamation />,
            count: 4,
            title: "Expiring Soon",
            subTitle: "Within the next 7 days",
            color: "#ff9800"
        },
    ]

    return (
        <>
            <section className="announcementStats-section">
                <div className="announementStats-container">
                    {
                        cardData && cardData.map((el, id) => (
                            <div className="announcementStats-card" key={id}>
                                <div className="announcementStats-card-icon" style={{background: el.color}}>{el.icon}</div>
                                <div className="announcementStats-card-content">
                                    <span>{el.count}</span>
                                    <span>{el.title}</span>
                                    <span>{el.subTitle}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </>
    )
}