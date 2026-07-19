import "../../components/Dashboard/DashboardAttendance.css"


export const DashboardAttendance = () => {
    return (
        <>
            <div className="dashboardAttendance-container">
                <div className="dashboardAttendence-header">
                    <h3>Attendance Records</h3>
                    <span>Today — Thursday, June 26, 2026</span>
                </div>
                <div className="dashboarAttendance-details">
                    <div className="dashboardAttendance-details-head">
                        <div>EMPLOYEE</div>
                        <div>CHECK IN</div>
                        <div>BREAK TIME</div>
                        <div>CHECK OUT</div>
                        <div>WORKING HOURS</div>
                        <div>STATUS</div>
                    </div>
                    <div className="dashboardAttendance-users">
                        <div>
                            <div>
                                <div className="dashboardAttendance-avatar">SM</div>
                                <div>
                                    <p style={{fontSize: "14px"}}>Sarah Mitchell</p>
                                    <span style={{fontSize: "11px", opacity: "0.7"}}>Design</span>
                                </div>
                            </div>
                            <div style={{color: "#4a9f91"}}>09:02</div>
                            <div>13:00–13:45</div>
                            <div>18:10</div>
                            <div style={{color: "#fff", fontWeight: "bold"}}>8h 23m</div>
                            <div className="dashboardAttendance-status">
                                <div></div>
                                <span>Present</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="dashboardAttendance-avatar">SM</div>
                                <div>
                                    <p style={{fontSize: "14px"}}>Sarah Mitchell</p>
                                    <span style={{fontSize: "11px", opacity: "0.7"}}>Design</span>
                                </div>
                            </div>
                            <div style={{color: "#4a9f91"}}>09:02</div>
                            <div>13:00–13:45</div>
                            <div>18:10</div>
                            <div style={{color: "#fff", fontWeight: "bold"}}>8h 23m</div>
                            <div className="dashboardAttendance-status">
                                <div></div>
                                <span>Present</span>
                            </div>
                        </div>
                        <div style={{border: "none"}}>
                            <div>
                                <div className="dashboardAttendance-avatar">SM</div>
                                <div>
                                    <p style={{fontSize: "14px"}}>Sarah Mitchell</p>
                                    <span style={{fontSize: "11px", opacity: "0.7"}}>Design</span>
                                </div>
                            </div>
                            <div style={{color: "#4a9f91"}}>09:02</div>
                            <div>13:00–13:45</div>
                            <div>18:10</div>
                            <div style={{color: "#fff", fontWeight: "bold"}}>8h 23m</div>
                            <div className="dashboardAttendance-status">
                                <div></div>
                                <span>Present</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}