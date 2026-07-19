import "../Dashboard/DashboardAnnouncement.css"

import { FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

export const DashboardAnnouncement = () => {
    return (
        <>
            <div className="dashboardAnnouncement-container">
                <div className="dashboardAnnouncement-header">
                    <div className="dashboardAnnouncement-heading">
                        <h3>Company Announcements</h3>
                        <span>Manage company-wide communications and events</span>
                    </div>
                    <div className="dashboardAnnouncement-new">
                        <FaPlus style={{color: "#42a47f"}} />
                        <span>New Announcement</span>
                    </div>
                </div>
                <div className="dashboardAnnouncement-content">
                    <div className="dashboardAnnouncement-content-card">
                        <div className="dashboardAnnouncement-header">
                            <div className="dashboardAnnouncement-category">Company</div>
                            <div className="dashboardAnnouncement-date">July 8 · 3:00 PM</div>
                        </div>
                        <div className="dashboardAnnouncement-title">
                            <h3>Q2 All-Hands Meeting</h3>
                        </div>
                        <div className="dashboardAnnouncement-description">
                            <p>Quarterly all-hands via Zoom. Link will be emailed 30 minutes before the session.</p>
                        </div>
                        <div className="dashboardAnnouncement-actions">
                            <div className="announcement-edit">
                                <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                <span style={{color: "#39a4ec", fontSize: "12px"}}>Edit</span>
                            </div>
                            <div className="announcement-delete">
                                <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                <span style={{color: "#ee4f74", fontSize: "12px"}}>Delete</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboardAnnouncement-content-card">
                        <div className="dashboardAnnouncement-header">
                            <div className="dashboardAnnouncement-category">Holiday</div>
                            <div className="dashboardAnnouncement-date">July 4 · Full Day</div>
                        </div>
                        <div className="dashboardAnnouncement-title">
                            <h3>Independence Day Holiday</h3>
                        </div>
                        <div className="dashboardAnnouncement-description">
                            <p>Office closed. Skeleton crew on-call. Enjoy the long weekend!</p>
                        </div>
                        <div className="dashboardAnnouncement-actions">
                            <div className="announcement-edit">
                                <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                <span style={{color: "#39a4ec", fontSize: "12px"}}>Edit</span>
                            </div>
                            <div className="announcement-delete">
                                <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                <span style={{color: "#ee4f74", fontSize: "12px"}}>Delete</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboardAnnouncement-content-card">
                        <div className="dashboardAnnouncement-header">
                            <div className="dashboardAnnouncement-category">Policy</div>
                            <div className="dashboardAnnouncement-date">Effective Aug 1</div>
                        </div>
                        <div className="dashboardAnnouncement-title">
                            <h3>New Remote Work Policy</h3>
                        </div>
                        <div className="dashboardAnnouncement-description">
                            <p>Updated WFH policy: 3 days in-office per week minimum for all non-remote roles.</p>
                        </div>
                        <div className="dashboardAnnouncement-actions">
                            <div className="announcement-edit">
                                <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                <span style={{color: "#39a4ec", fontSize: "12px"}}>Edit</span>
                            </div>
                            <div className="announcement-delete">
                                <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                <span style={{color: "#ee4f74", fontSize: "12px"}}>Delete</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboardAnnouncement-content-card">
                        <div className="dashboardAnnouncement-header">
                            <div className="dashboardAnnouncement-category">Event</div>
                            <div className="dashboardAnnouncement-date">July 19 · 4:00 PM</div>
                        </div>
                        <div className="dashboardAnnouncement-title">
                            <h3>Team Building — Escape Room</h3>
                        </div>
                        <div className="dashboardAnnouncement-description">
                            <p>Voluntary team outing at Puzzle Break. Register by July 14th to secure a spot.</p>
                        </div>
                        <div className="dashboardAnnouncement-actions">
                            <div className="announcement-edit">
                                <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                <span style={{color: "#39a4ec", fontSize: "12px"}}>Edit</span>
                            </div>
                            <div className="announcement-delete">
                                <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                <span style={{color: "#ee4f74", fontSize: "12px"}}>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}