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

  const formattedRequests = useMemo(() => {
    return adminRequests.map((request) => ({
      ...request,

      id: request._id,

      employee: request.user || request.employee,

      user: request.user || request.employee,
    }));
  }, [adminRequests]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveRequest = async (request) => {
    const leaveID = request?.id || request?._id;

    if (!leaveID) {
      return;
    }

    try {
      await dispatch(approveAdminLeave(leaveID)).unwrap();

      await dispatch(fetchAdminLeaves()).unwrap();
      await dispatch(fetchLeaveStatistics()).unwrap();

      setIsDetailsOpen(false);
      setSelectedRequest(null);
    } catch (approveError) {
      console.error("Approve Leave Error:", approveError);
    }
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(false);
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const handleConfirmReject = async ({ request, reason }) => {
    const leaveID = request?.id || request?._id;

    if (!leaveID) {
      return;
    }

    try {
      await dispatch(
        rejectAdminLeave({
          leaveID,
          adminComment: reason,
        }),
      ).unwrap();

      await dispatch(fetchAdminLeaves()).unwrap();
      await dispatch(fetchLeaveStatistics()).unwrap();

      setIsRejectModalOpen(false);
      setSelectedRequest(null);
    } catch (rejectError) {
      console.error("Reject Leave Error:", rejectError);
      throw rejectError;
    }
  };

  return (
    <div className="dashboard_leave">
      <LeaveStats statistics={adminStatistics} requests={formattedRequests} />

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
        onClose={handleCloseDetails}
        onApprove={handleApproveRequest}
        onReject={handleOpenRejectModal}
      />

      <RejectLeaveModal
        isOpen={isRejectModalOpen}
        request={selectedRequest}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
      />

      {error && <p className="dashboard_leave_error">{error}</p>}
    </div>
  );
};

export default DashboardLeave;
