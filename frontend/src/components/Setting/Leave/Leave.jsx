// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import "./Leave.css";

// import LeaveBalance from "../../Leave/Employee/LeaveBalance/LeaveBalance";
// import ApplyLeave from "../../Leave/Employee/ApplyLeave/ApplyLeave";
// import LeaveHistory from "../../Leave/Employee/LeaveHistory/LeaveHistory";

// import {
//   fetchLeaveBalance,
//   fetchMyLeaves,
// } from "../../../store/leaveSlice";

// const leaveTypeLabels = {
//   annual: "Annual Leave",
//   sick: "Sick Leave",
//   casual: "Casual Leave",
// };

// const formatDate = (date) => {
//   if (!date) return "";

//   return new Date(date).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const Leave = () => {
//   const dispatch = useDispatch();

//   const {
//     balance,
//     requests = [],
//     pagination = null,
//     loading = false,
//     error = null,
//   } = useSelector((state) => state.leave);

//   const [showApplyLeave, setShowApplyLeave] = useState(false);
//   const [page, setPage] = useState(1);
//   const [status, setStatus] = useState("All");

//   const limit = 10;

//   const fetchLeaveHistory = useCallback(
//     async (currentPage, currentStatus) => {
//       await dispatch(
//         fetchMyLeaves({
//           page: currentPage,
//           limit,
//           status: currentStatus,
//         }),
//       ).unwrap();
//     },
//     [dispatch],
//   );

//   useEffect(() => {
//     const loadLeaveBalance = async () => {
//       try {
//         await dispatch(fetchLeaveBalance()).unwrap();
//       } catch (balanceError) {
//         console.error(
//           "Fetch Leave Balance Error:",
//           balanceError,
//         );
//       }
//     };

//     loadLeaveBalance();
//   }, [dispatch]);

//   useEffect(() => {
//     const loadLeaveHistory = async () => {
//       try {
//         await fetchLeaveHistory(page, status);
//       } catch (historyError) {
//         console.error(
//           "Fetch Leave History Error:",
//           historyError,
//         );
//       }
//     };

//     loadLeaveHistory();
//   }, [fetchLeaveHistory, page, status]);

//   const formattedRequests = useMemo(
//     () =>
//       requests.map((request) => ({
//         id: request._id,
//         leaveType:
//           leaveTypeLabels[request.leaveType] || request.leaveType,
//         leaveTypeValue: request.leaveType,
//         startDate: formatDate(request.startDate),
//         endDate: formatDate(request.endDate),
//         requestedDays: request.totalDays,
//         reason: request.reason,
//         status: request.status,
//         appliedDate: formatDate(request.appliedAt),
//         adminComment: request.adminComment || "",
//         rawRequest: request,
//       })),
//     [requests],
//   );

//   const handleOpenApplyLeave = () => {
//     setShowApplyLeave(true);
//   };

//   const handleCloseApplyLeave = () => {
//     setShowApplyLeave(false);
//   };

//   const handleStatusChange = (newStatus) => {
//     if (newStatus === status) {
//       return;
//     }

//     setStatus(newStatus);
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     const totalPages = pagination?.totalPages || 0;

//     if (newPage < 1) {
//       return;
//     }

//     if (totalPages > 0 && newPage > totalPages) {
//       return;
//     }

//     if (newPage === page) {
//       return;
//     }

//     setPage(newPage);
//   };

//   const handleApplyLeaveSuccess = async () => {
//     await dispatch(fetchLeaveBalance()).unwrap();
//     await fetchLeaveHistory(page, status);

//     handleCloseApplyLeave();
//   };

//   const handleCancelRequest = async () => {
//     try {
//       await dispatch(fetchLeaveBalance()).unwrap();

//       const totalPages = pagination?.totalPages || 1;
//       const isLastItemOnPage = requests.length === 1;
//       const isLastPage = page === totalPages;

//       if (isLastItemOnPage && isLastPage && page > 1) {
//         setPage((currentPage) => currentPage - 1);
//         return;
//       }

//       await fetchLeaveHistory(page, status);
//     } catch (refreshError) {
//       console.error(
//         "Refresh Leave Data Error:",
//         refreshError,
//       );

//       throw refreshError;
//     }
//   };

//   const isInitialLoading =
//     loading &&
//     !error &&
//     !balance &&
//     requests.length === 0;

//   return (
//     <main className="leave-page">
//       <header className="leave-page-header">
//         <div className="leave-page-heading">
//           <h1>Leave</h1>
//           <p>Manage your leave requests and balances.</p>
//         </div>

//         <button
//           type="button"
//           className="leave-apply-btn"
//           onClick={handleOpenApplyLeave}
//           disabled={loading}
//         >
//           Apply for Leave
//         </button>
//       </header>

//       <div className="leave-page-content">
//         {isInitialLoading ? (
//           <div className="leave-page-loading">
//             <span>Loading leave information...</span>
//           </div>
//         ) : (
//           <>
//             <LeaveBalance balance={balance} />

//             <LeaveHistory
//               requests={formattedRequests}
//               loading={loading}
//               activeFilter={status}
//               pagination={pagination}
//               onFilterChange={handleStatusChange}
//               onPageChange={handlePageChange}
//               onCancelRequest={handleCancelRequest}
//             />
//           </>
//         )}

//         {error && (
//           <div className="leave-page-error" role="alert">
//             {error}
//           </div>
//         )}
//       </div>

//       {showApplyLeave && (
//         <ApplyLeave
//           onClose={handleCloseApplyLeave}
//           onSuccess={handleApplyLeaveSuccess}
//         />
//       )}
//     </main>
//   );
// };

// export default Leave;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Leave.css";

import LeaveBalance from "../../Leave/Employee/LeaveBalance/LeaveBalance";
import ApplyLeave from "../../Leave/Employee/ApplyLeave/ApplyLeave";
import LeaveHistory from "../../Leave/Employee/LeaveHistory/LeaveHistory";

import {
  fetchLeaveBalance,
  fetchMyLeaves,
} from "../../../store/leaveSlice";

import Skeleton from "../../../components/Skeleton/Skeleton";

const leaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Leave = () => {
  const dispatch = useDispatch();

  /* ==========================================
     SKELETON LOADING
  ========================================== */

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /* ==========================================
     REDUX STATE
  ========================================== */

  const {
    balance,
    requests = [],
    pagination = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.leave);

  /* ==========================================
     LOCAL STATES
  ========================================== */

  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");

  const limit = 10;

  /* ==========================================
     FETCH LEAVE HISTORY
  ========================================== */

  const fetchLeaveHistory = useCallback(
    async (currentPage, currentStatus) => {
      await dispatch(
        fetchMyLeaves({
          page: currentPage,
          limit,
          status: currentStatus,
        })
      ).unwrap();
    },
    [dispatch]
  );

  /* ==========================================
     FETCH LEAVE BALANCE
  ========================================== */

  useEffect(() => {
    const loadLeaveBalance = async () => {
      try {
        await dispatch(fetchLeaveBalance()).unwrap();
      } catch (balanceError) {
        console.error(
          "Fetch Leave Balance Error:",
          balanceError
        );
      }
    };

    loadLeaveBalance();
  }, [dispatch]);

  /* ==========================================
     FETCH LEAVE HISTORY
  ========================================== */

  useEffect(() => {
    const loadLeaveHistory = async () => {
      try {
        await fetchLeaveHistory(page, status);
      } catch (historyError) {
        console.error(
          "Fetch Leave History Error:",
          historyError
        );
      }
    };

    loadLeaveHistory();
  }, [fetchLeaveHistory, page, status]);

  /* ==========================================
     FORMAT REQUESTS
  ========================================== */

  const formattedRequests = useMemo(
    () =>
      requests.map((request) => ({
        id: request._id,

        leaveType:
          leaveTypeLabels[request.leaveType] ||
          request.leaveType,

        leaveTypeValue: request.leaveType,

        startDate: formatDate(request.startDate),

        endDate: formatDate(request.endDate),

        requestedDays: request.totalDays,

        reason: request.reason,

        status: request.status,

        appliedDate: formatDate(request.appliedAt),

        adminComment: request.adminComment || "",

        rawRequest: request,
      })),
    [requests]
  );

  /* ==========================================
     APPLY LEAVE
  ========================================== */

  const handleOpenApplyLeave = () => {
    setShowApplyLeave(true);
  };

  const handleCloseApplyLeave = () => {
    setShowApplyLeave(false);
  };

  /* ==========================================
     STATUS CHANGE
  ========================================== */

  const handleStatusChange = (newStatus) => {
    if (newStatus === status) {
      return;
    }

    setStatus(newStatus);
    setPage(1);
  };

  /* ==========================================
     PAGE CHANGE
  ========================================== */

  const handlePageChange = (newPage) => {
    const totalPages = pagination?.totalPages || 0;

    if (newPage < 1) {
      return;
    }

    if (
      totalPages > 0 &&
      newPage > totalPages
    ) {
      return;
    }

    if (newPage === page) {
      return;
    }

    setPage(newPage);
  };

  /* ==========================================
     APPLY LEAVE SUCCESS
  ========================================== */

  const handleApplyLeaveSuccess = async () => {
    await dispatch(fetchLeaveBalance()).unwrap();

    await fetchLeaveHistory(page, status);

    handleCloseApplyLeave();
  };

  /* ==========================================
     CANCEL REQUEST
  ========================================== */

  const handleCancelRequest = async () => {
    try {
      await dispatch(fetchLeaveBalance()).unwrap();

      const totalPages =
        pagination?.totalPages || 1;

      const isLastItemOnPage =
        requests.length === 1;

      const isLastPage =
        page === totalPages;

      if (
        isLastItemOnPage &&
        isLastPage &&
        page > 1
      ) {
        setPage(
          (currentPage) => currentPage - 1
        );

        return;
      }

      await fetchLeaveHistory(page, status);

    } catch (refreshError) {
      console.error(
        "Refresh Leave Data Error:",
        refreshError
      );

      throw refreshError;
    }
  };

  /* ==========================================
     UI
  ========================================== */

  return (
    <main className="leave-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <header className="leave-page-header">

        <div className="leave-page-heading">

          {showSkeleton ? (
            <>
              <Skeleton
                width="75px"
                height="32px"
              />

              <div className="leave-header-skeleton-text">
                <Skeleton
                  width="315px"
                  height="16px"
                />
              </div>
            </>
          ) : (
            <>
              <h1>Leave</h1>

              <p>
                Manage your leave requests and balances.
              </p>
            </>
          )}

        </div>


        {showSkeleton ? (
          <Skeleton
            width="145px"
            height="42px"
            radius="8px"
          />
        ) : (
          <button
            type="button"
            className="leave-apply-btn"
            onClick={handleOpenApplyLeave}
            disabled={loading}
          >
            Apply for Leave
          </button>
        )}

      </header>


      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <div className="leave-page-content">

        {showSkeleton ? (

          <div className="leave-skeleton-wrapper">

            {/* ==================================
                LEAVE BALANCE
            ================================== */}

            <div className="leave-balance-skeleton">

              <div className="leave-balance-skeleton-heading">

                <Skeleton
                  width="135px"
                  height="24px"
                />

              </div>


              <div className="leave-balance-skeleton-cards">

                {/* CARD 1 */}

                <div className="leave-balance-skeleton-card">

                  <Skeleton
                    width="105px"
                    height="14px"
                  />

                  <div className="leave-skeleton-number">
                    <Skeleton
                      width="45px"
                      height="30px"
                    />
                  </div>

                  <div className="leave-skeleton-available">
                    <Skeleton
                      width="90px"
                      height="12px"
                    />
                  </div>

                  <div className="leave-skeleton-line">
                    <Skeleton
                      width="100%"
                      height="1px"
                    />
                  </div>

                  <div className="leave-skeleton-used">

                    <div>
                      <Skeleton
                        width="35px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="20px"
                          height="14px"
                        />
                      </div>
                    </div>

                    <div>
                      <Skeleton
                        width="55px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="25px"
                          height="14px"
                        />
                      </div>
                    </div>

                  </div>

                </div>


                {/* CARD 2 */}

                <div className="leave-balance-skeleton-card">

                  <Skeleton
                    width="105px"
                    height="14px"
                  />

                  <div className="leave-skeleton-number">
                    <Skeleton
                      width="45px"
                      height="30px"
                    />
                  </div>

                  <div className="leave-skeleton-available">
                    <Skeleton
                      width="90px"
                      height="12px"
                    />
                  </div>

                  <div className="leave-skeleton-line">
                    <Skeleton
                      width="100%"
                      height="1px"
                    />
                  </div>

                  <div className="leave-skeleton-used">

                    <div>
                      <Skeleton
                        width="35px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="20px"
                          height="14px"
                        />
                      </div>
                    </div>

                    <div>
                      <Skeleton
                        width="55px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="25px"
                          height="14px"
                        />
                      </div>
                    </div>

                  </div>

                </div>


                {/* CARD 3 */}

                <div className="leave-balance-skeleton-card">

                  <Skeleton
                    width="105px"
                    height="14px"
                  />

                  <div className="leave-skeleton-number">
                    <Skeleton
                      width="45px"
                      height="30px"
                    />
                  </div>

                  <div className="leave-skeleton-available">
                    <Skeleton
                      width="90px"
                      height="12px"
                    />
                  </div>

                  <div className="leave-skeleton-line">
                    <Skeleton
                      width="100%"
                      height="1px"
                    />
                  </div>

                  <div className="leave-skeleton-used">

                    <div>
                      <Skeleton
                        width="35px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="20px"
                          height="14px"
                        />
                      </div>
                    </div>

                    <div>
                      <Skeleton
                        width="55px"
                        height="11px"
                      />

                      <div className="leave-skeleton-small-gap">
                        <Skeleton
                          width="25px"
                          height="14px"
                        />
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================
                LEAVE REQUESTS
            ================================== */}

            <div className="leave-requests-skeleton">

              {/* HEADER */}

              <div className="leave-requests-skeleton-header">

                <Skeleton
                  width="125px"
                  height="24px"
                />

                <div className="leave-request-subtitle">

                  <Skeleton
                    width="240px"
                    height="13px"
                  />

                </div>

              </div>


              {/* FILTER + COUNT */}

              <div className="leave-requests-filter-area">

                <div className="leave-filter-section">

                  <Skeleton
                    width="105px"
                    height="12px"
                  />


                  <div className="leave-select-skeleton">

                    <Skeleton
                      width="105px"
                      height="16px"
                    />

                    <Skeleton
                      width="8px"
                      height="8px"
                      radius="50%"
                    />

                  </div>

                </div>


                <Skeleton
                  width="48px"
                  height="12px"
                />

              </div>


              {/* TABLE */}

              <div className="leave-request-table-skeleton">

                {/* TABLE HEADER */}

                <div className="leave-table-header-skeleton">

                  <Skeleton
                    width="70px"
                    height="10px"
                  />

                  <Skeleton
                    width="40px"
                    height="10px"
                  />

                  <Skeleton
                    width="30px"
                    height="10px"
                  />

                  <Skeleton
                    width="42px"
                    height="10px"
                  />

                  <Skeleton
                    width="42px"
                    height="10px"
                  />

                  <Skeleton
                    width="22px"
                    height="10px"
                  />

                </div>


                {/* ONE REQUEST */}

                <div className="leave-table-row-skeleton">

                  {/* LEAVE TYPE */}

                  <Skeleton
                    width="105px"
                    height="13px"
                  />


                  {/* DATES */}

                  <Skeleton
                    width="150px"
                    height="13px"
                  />


                  {/* DAYS */}

                  <Skeleton
                    width="18px"
                    height="13px"
                  />


                  {/* STATUS */}

                  <Skeleton
                    width="62px"
                    height="22px"
                    radius="15px"
                  />


                  {/* APPLIED */}

                  <Skeleton
                    width="95px"
                    height="13px"
                  />


                  {/* VIEW */}

                  <Skeleton
                    width="28px"
                    height="28px"
                    radius="7px"
                  />

                </div>

              </div>

            </div>

          </div>

        ) : (

          <>
            <LeaveBalance
              balance={balance}
            />

            <LeaveHistory
              requests={formattedRequests}
              loading={loading}
              activeFilter={status}
              pagination={pagination}
              onFilterChange={handleStatusChange}
              onPageChange={handlePageChange}
              onCancelRequest={handleCancelRequest}
            />
          </>

        )}


        {/* ERROR */}

        {error && (
          <div
            className="leave-page-error"
            role="alert"
          >
            {error}
          </div>
        )}

      </div>


      {/* ======================================
          APPLY LEAVE MODAL
      ====================================== */}

      {showApplyLeave && (
        <ApplyLeave
          onClose={handleCloseApplyLeave}
          onSuccess={handleApplyLeaveSuccess}
        />
      )}

    </main>
  );
};

export default Leave;