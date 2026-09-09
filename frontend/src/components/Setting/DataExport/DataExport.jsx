// import { FiDownload } from "react-icons/fi";

// import "./DataExport.css"


// export const DataExport = () => {


//     return (
//         <>
//             <div className="dataexport-container">
//                 <div className="dataexport-heading">
//                     <h2>Data & Export</h2>
//                     <p>Download your attendance records and generate reports.</p>
//                 </div>

//                 {/* export attendance data */}
//                 <div className="export-attendance-data">
//                     <div className="attendance-export-heading">
//                         <h3>Export attendance data</h3>
//                     </div>
//                     <div className="attendance-range-format">
//                         <div className="date-range">
//                             <div className="data-range-selection">
//                                 <label htmlFor="daterange">Date range</label>
//                                 <select>
//                                     <option value="this month">This month</option>
//                                     <option value="last month">Last month</option>
//                                     <option value="last three months">Last three months</option>
//                                     <option value="last year">Last year</option>
//                                     <option value="custom range">Custom range</option>
//                                 </select>
//                             </div>
//                             <div className="download-attendance">
//                                 <FiDownload className="download-icon" />
//                                 <button type="button">Download CSV</button>
//                             </div>
//                         </div>
//                         <div className="file-format">
//                             <label htmlFor="fileformat">File formate</label>
//                             <select>
//                                 <option value="CSV">CSV</option>
//                                 <option value="Excel">Excel (.xlsx)</option>
//                                 <option value="PDF">PDF</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent exports */}
//                 <div className="recent-export">
//                     <div className="recent-heading">
//                         <h3>Recent Export</h3>
//                     </div>
//                     <div className="recent-export-content">
//                         <div className="attendance-report">
//                             <div>
//                                 <h3>Attendance Report - June 2026</h3>
//                                 <p>June 30, 2026 · 48 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                         <div className="monthly-summary">
//                             <div>
//                                 <h3>Monthly Summary - June 2026</h3>
//                                 <p>June 30, 2026 · 61 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                         <div className="leave-balance-report">
//                             <div>
//                                 <h3>Leave Balance Report</h3>
//                                 <p>June 30, 2026 · 22 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Data retention */}
//                 <div className="data-retention">
//                     <div className="retention-heading">
//                         <h3>Data retention</h3>
//                     </div>
//                     <div className="retention-content">
//                         <p>Your attendance data is retained for 7 years in compliance with labor regulations. You may request a full data export or deletion via your organization admin.</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

import { FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";

import "./DataExport.css";
import Skeleton from "../../../components/Skeleton/Skeleton";

export const DataExport = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // SKELETON UI
  // =========================

  if (showSkeleton) {
    return (
      <div className="dataexport-container">

        {/* Heading Skeleton */}
        <div className="dataexport-heading">
          <Skeleton width="200px" height="25px" />

          <div className="skeleton-heading-text">
            <Skeleton width="420px" height="15px" />
          </div>
        </div>

        {/* Export Attendance Skeleton */}
        <div className="export-attendance-data">

          <div className="attendance-export-heading">
            <Skeleton width="200px" height="20px" />
          </div>

          <div className="attendance-range-format">

            {/* Left Side */}
            <div className="date-range">

              <div className="data-range-selection">
                <Skeleton width="90px" height="15px" />

                <Skeleton width="200px" height="42px" radius="10px" />
              </div>
<div className="skeleton-download-attendance">
  <Skeleton width="150px" height="42px" radius="6px" />
</div>

            </div>

            {/* Right Side */}
            <div className="file-format">
              <Skeleton width="90px" height="15px" />

              <Skeleton width="200px" height="42px" radius="10px" />
            </div>

          </div>
        </div>

        {/* Recent Export Skeleton */}
        <div className="recent-export">

          <div className="recent-heading">
            <Skeleton width="150px" height="20px" />
          </div>

          <div className="recent-export-content">

            {[1, 2, 3].map((item) => (
              <div className="skeleton-export-row" key={item}>

                <div className="skeleton-export-info">
                  <Skeleton width="260px" height="18px" />

                  <Skeleton width="170px" height="14px" />
                </div>

                <Skeleton width="100px" height="35px" radius="6px" />

              </div>
            ))}

          </div>
        </div>

        {/* Data Retention Skeleton */}
        <div className="data-retention">

          <div className="retention-heading">
            <Skeleton width="130px" height="20px" />
          </div>

          <div className="retention-content skeleton-retention-content">
            <Skeleton width="100%" height="14px" />
            <Skeleton width="85%" height="14px" />
            <Skeleton width="65%" height="14px" />
          </div>

        </div>

      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================

  return (
    <div className="dataexport-container">

      <div className="dataexport-heading">
        <h2>Data & Export</h2>
        <p>Download your attendance records and generate reports.</p>
      </div>

      {/* Export attendance data */}
      <div className="export-attendance-data">

        <div className="attendance-export-heading">
          <h3>Export attendance data</h3>
        </div>

        <div className="attendance-range-format">

          <div className="date-range">

            <div className="data-range-selection">
              <label>Date range</label>

              <select>
                <option>This month</option>
                <option>Last month</option>
                <option>Last three months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>

            <div className="download-attendance">
              <FiDownload className="download-icon" />
              <button type="button">Download CSV</button>
            </div>

          </div>

          <div className="file-format">
            <label>File format</label>

            <select>
              <option>CSV</option>
              <option>Excel (.xlsx)</option>
              <option>PDF</option>
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
          <p>
            Your attendance data is retained for 7 years in compliance with
            labor regulations. You may request a full data export or deletion
            via your organization admin.
          </p>
        </div>

      </div>

    </div>
  );
};