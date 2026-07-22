import { FiDownload } from "react-icons/fi";

import "./DataExport.css"


export const DataExport = () => {


    return (
        <>
            <div className="dataexport-container">
                <div className="dataexport-heading">
                    <h2>Data & Export</h2>
                    <p>Download your attendance records and generate reports.</p>
                </div>

                {/* export attendance data */}
                <div className="export-attendance-data">
                    <div className="attendance-export-heading">
                        <h3>Export attendance data</h3>
                    </div>
                    <div className="attendance-range-format">
                        <div className="date-range">
                            <div className="data-range-selection">
                                <label htmlFor="daterange">Date range</label>
                                <select>
                                    <option value="this month">This month</option>
                                    <option value="last month">Last month</option>
                                    <option value="last three months">Last three months</option>
                                    <option value="last year">Last year</option>
                                    <option value="custom range">Custom range</option>
                                </select>
                            </div>
                            <div className="download-attendance">
                                <FiDownload className="download-icon" />
                                <button type="button">Download CSV</button>
                            </div>
                        </div>
                        <div className="file-format">
                            <label htmlFor="fileformat">File formate</label>
                            <select>
                                <option value="CSV">CSV</option>
                                <option value="Excel">Excel (.xlsx)</option>
                                <option value="PDF">PDF</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Recent exports */}
                <div className="recent-export">
                    <div className="recent-heading">
                        <h3>Recent Export</h3>
                    </div>
                    <div className="recent-export-content">
                        <div className="attendance-report">
                            <div>
                                <h3>Attendance Report - June 2026</h3>
                                <p>June 30, 2026 · 48 KB</p>
                            </div>
                            <div className="download-container">
                                <FiDownload className="fidownload" />
                                <button type="button">Download</button>
                            </div>
                        </div>
                        <div className="monthly-summary">
                            <div>
                                <h3>Monthly Summary - June 2026</h3>
                                <p>June 30, 2026 · 61 KB</p>
                            </div>
                            <div className="download-container">
                                <FiDownload className="fidownload" />
                                <button type="button">Download</button>
                            </div>
                        </div>
                        <div className="leave-balance-report">
                            <div>
                                <h3>Leave Balance Report</h3>
                                <p>June 30, 2026 · 22 KB</p>
                            </div>
                            <div className="download-container">
                                <FiDownload className="fidownload" />
                                <button type="button">Download</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data retention */}
                <div className="data-retention">
                    <div className="retention-heading">
                        <h3>Data retention</h3>
                    </div>
                    <div className="retention-content">
                        <p>Your attendance data is retained for 7 years in compliance with labor regulations. You may request a full data export or deletion via your organization admin.</p>
                    </div>
                </div>
            </div>
        </>
    )
}