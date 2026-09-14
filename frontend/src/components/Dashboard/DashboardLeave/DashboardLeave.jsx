import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./DashboardLeave.css";

import LeaveStats from "./LeaveStats/LeaveStats";
import LeaveRequests from "./LeaveRequests/LeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails/LeaveRequestDetails";
import RejectLeaveModal from "./RejectLeaveModal/RejectLeaveModal";

import {
  fetchAdminLeaves,
  approveAdminLeave,
  fetchLeaveStatistics,
} from "../../../store/leaveSlice";

const getLeaveId = (request) => request?.id || request?._id;

export const DashboardLeave = () => {
  const dispatch = useDispatch();

  const {
    adminRequests = [],
    adminStatistics = null,
    adminPagination = null,
    loading,
    error,
  } = useSelector((state) => state.leave);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const refreshLeaveData = useCallback(async () => {
    await dispatch(
      fetchAdminLeaves({
        page: adminPagination?.page || 1,
        limit: adminPagination?.limit || 10,
        status: adminPagination?.status || "All",
        search: adminPagination?.search || "",
      }),
    ).unwrap();

    await dispatch(fetchLeaveStatistics()).unwrap();
  }, [dispatch, adminPagination]);

  const closeRequestDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRequest(null);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleApproveRequest = async (request) => {
    const leaveID = getLeaveId(request);

    if (!leaveID) {
      return;
    }

    try {
      await dispatch(approveAdminLeave(leaveID)).unwrap();

      await refreshLeaveData();

      closeRequestDetails();
    } catch (approveError) {
      console.error("Approve Leave Error:", approveError);
    }
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(false);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    try {
      await refreshLeaveData();
      closeRejectModal();
    } catch (refreshError) {
      console.error("Refresh Leave Data Error:", refreshError);
    }
  };

  return (
    <div className="dashboard_leave">
      <LeaveStats
        statistics={adminStatistics}
        requests={adminRequests}
      />

      <LeaveRequests
        onView={handleViewRequest}
        onApprove={handleApproveRequest}
        onReject={handleOpenRejectModal}
      />

      <LeaveRequestDetails
        isOpen={isDetailsOpen}
        request={selectedRequest}
        onClose={closeRequestDetails}
        onApprove={handleApproveRequest}
        onReject={handleOpenRejectModal}
      />

      <RejectLeaveModal
        isOpen={isRejectModalOpen}
        request={selectedRequest}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
      />

      {error && <p className="dashboard_leave_error">{error}</p>}
    </div>
  );
};

export default DashboardLeave;