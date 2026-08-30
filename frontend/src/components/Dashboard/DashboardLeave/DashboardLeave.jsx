import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./DashboardLeave.css";

import LeaveStats from "./LeaveStats/LeaveStats";
import LeaveRequests from "./LeaveRequests/LeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails/LeaveRequestDetails";
import RejectLeaveModal from "./RejectLeaveModal/RejectLeaveModal";

import {
  fetchAdminLeaves,
  approveAdminLeave,
  rejectAdminLeave,
  fetchLeaveStatistics,
} from "../../../store/leaveSlice";

const getLeaveId = (request) => request?.id || request?._id;

const formatRequests = (requests) =>
  requests.map((request) => ({
    ...request,
    id: request._id,
    employee: request.user || request.employee,
    user: request.user || request.employee,
  }));

export const DashboardLeave = () => {
  const dispatch = useDispatch();

  const {
    adminRequests = [],
    adminStatistics = null,
    loading,
    error,
  } = useSelector((state) => state.leave);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminLeaves());
    dispatch(fetchLeaveStatistics());
  }, [dispatch]);

  const formattedRequests = useMemo(
    () => formatRequests(adminRequests),
    [adminRequests]
  );

  const refreshLeaveData = async () => {
    await dispatch(fetchAdminLeaves()).unwrap();
    await dispatch(fetchLeaveStatistics()).unwrap();
  };

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

  const handleConfirmReject = async ({ request, reason }) => {
    const leaveID = getLeaveId(request);

    if (!leaveID) {
      return;
    }

    try {
      await dispatch(
        rejectAdminLeave({
          leaveID,
          adminComment: reason,
        })
      ).unwrap();

      await refreshLeaveData();

      closeRejectModal();
    } catch (rejectError) {
      console.error("Reject Leave Error:", rejectError);
      throw rejectError;
    }
  };

  return (
    <div className="dashboard_leave">
      <LeaveStats
        statistics={adminStatistics}
        requests={formattedRequests}
      />

      <LeaveRequests
        requests={formattedRequests}
        loading={loading}
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

      {error && (
        <p className="dashboard_leave_error">
          {error}
        </p>
      )}
    </div>
  );
};

export default DashboardLeave;