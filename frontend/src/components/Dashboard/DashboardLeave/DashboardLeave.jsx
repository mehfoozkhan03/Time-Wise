import { useState } from "react";

import "./DashboardLeave.css";

import LeaveStats from "./LeaveStats/LeaveStats";
import LeaveRequests from "./LeaveRequests/LeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails/LeaveRequestDetails";
import RejectLeaveModal from "./RejectLeaveModal/RejectLeaveModal";

import leaveData from "../../../data/leaveData";

export const DashboardLeave = () => {
  const [requests, setRequests] = useState(leaveData);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  /* ==========================================
     VIEW REQUEST
  ========================================== */

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  /* ==========================================
     CLOSE DETAILS
  ========================================== */

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRequest(null);
  };

  /* ==========================================
     APPROVE REQUEST
  ========================================== */

  const handleApproveRequest = (request) => {
    if (!request) return;

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Approved",
            }
          : item
      )
    );

    setSelectedRequest((currentRequest) =>
      currentRequest
        ? {
            ...currentRequest,
            status: "Approved",
          }
        : null
    );
  };

  /* ==========================================
     OPEN REJECT MODAL
  ========================================== */

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);

    setIsDetailsOpen(false);
    setIsRejectModalOpen(true);
  };

  /* ==========================================
     CLOSE REJECT MODAL
  ========================================== */

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  /* ==========================================
     CONFIRM REJECTION
  ========================================== */

  const handleConfirmReject = ({ request, reason }) => {
    if (!request) return;

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Rejected",
              adminComment: reason,
            }
          : item
      )
    );

    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="dashboard_leave">
      {/* =====================================
          LEAVE STATS
      ===================================== */}

      <LeaveStats requests={requests} />

      {/* =====================================
          LEAVE REQUESTS
      ===================================== */}

      <LeaveRequests
        requests={requests}
        onView={handleViewRequest}
        onApprove={handleApproveRequest}
        onReject={handleOpenRejectModal}
      />

      {/* =====================================
          REQUEST DETAILS
      ===================================== */}

      <LeaveRequestDetails
        isOpen={isDetailsOpen}
        request={selectedRequest}
        onClose={handleCloseDetails}
        onApprove={handleApproveRequest}
        onReject={handleOpenRejectModal}
      />

      {/* =====================================
          REJECT MODAL
      ===================================== */}

      <RejectLeaveModal
        isOpen={isRejectModalOpen}
        request={selectedRequest}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};