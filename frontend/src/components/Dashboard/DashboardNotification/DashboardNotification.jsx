import { useEffect } from "react";
import { useState } from "react";

import { FaBell, FaCloud } from "react-icons/fa6";
import { RiTargetFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";


import "./DashboardNotification.css";
import { Modal } from "../../Modal/Modal";
import { adminNotificationService } from "../../../services/adminNotificationService";
import { NotificationDropdown } from "../Dropdowns/NotificationDropdown/NotificationDropdown";
import { PulseDot } from "./../../PulseDot/pulseDot";

const initialForm = {
  title: "",
  message: "",
  type: "announcement",
  audienceType: "all",
  targetDepartment: "",
  targetDesignation: "",
  targetUserId: "",
};

export const DashboardNotification = () => {
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [sending, setSending] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(null);

  const recentNotification = [
    {
      icon: <FaHeart style={{ color: "#ee2a44" }} />,
      notificationTitle: "Sarah Mitchell liked a thought post",
      time: "2m ago",
    },
    {
      icon: <FaTriangleExclamation style={{ color: "#f6be5d" }} />,
      notificationTitle: "3 employees haven't checked in today",
      time: "10m ago",
    },
    {
      icon: <FaBell style={{ color: "#ef9b52" }} />,
      notificationTitle: "Monthly attendance report is ready to export",
      time: "1h ago",
    },
    {
      icon: <FaCloud />,
      notificationTitle: "New comment on company announcement",
      time: "3h ago",
    },
    {
      icon: <RiTargetFill style={{ color: "#ff6da8" }} />,
      notificationTitle: "Attendance sync completed successfully",
      time: "Yesterday",
    },
  ];

  useEffect(() => {
    let cancelled = false;

    const loadRecipients = async () => {
      setLoadingRecipients(true);

      try {
        const { data } = await adminNotificationService.getRecipients(search);

        if (cancelled) return;

        setEmployees(data.employees || []);
        setDepartments(data.departments || []);
        setDesignations(data.designations || []);
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load notification recipients:", error);
        }
      } finally {
        if (!cancelled) setLoadingRecipients(false);
      }
    };

    loadRecipients();

    return () => {
      cancelled = true;
    };
  }, [search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,

      ...(name === "audienceType"
        ? {
            targetDepartment: "",
            targetDesignation: "",
            targetUserId: "",
          }
        : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.audienceType === "department" && !form.targetDepartment) {
      showFeedbackModal?.({
        variant: "warning",
        title: "Department Required",
        message: "Please select a department.",
      });
      return;
    }

    if (form.audienceType === "designation" && !form.targetDesignation) {
      showFeedbackModal?.({
        variant: "warning",
        title: "Designation Required",
        message: "Please select a designation.",
      });
      return;
    }

    if (form.audienceType === "specific" && !form.targetUserId) {
      showFeedbackModal?.({
        variant: "warning",
        title: "Employee Required",
        message: "Please select an employee.",
      });
      return;
    }

    setSending(true);

    try {
      const payload = {
        title: form.title,
        message: form.message,
        type: form.type,
        audienceType: form.audienceType,
        ...(form.audienceType === "department" && {
          targetDepartment: form.targetDepartment,
        }),
        ...(form.audienceType === "designation" && {
          targetDesignation: form.targetDesignation,
        }),
        ...(form.audienceType === "specific" && {
          targetUserId: form.targetUserId,
        }),
      };

      const { data } =
        await adminNotificationService.createNotification(payload);

      setForm(initialForm);
      setSearch("");

      showFeedbackModal?.({
        variant: "success",
        title: "Notification Sent",
        message: data.message || "Notification sent successfully.",
        description: `Sent to ${data.recipientCount ?? "the selected"} employee(s).`,
      });
    } catch (error) {
      showFeedbackModal?.({
        variant: "error",
        title: "Failed to Send",
        message:
          error.response?.data?.message ||
          "Unable to send notification. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="dashboardNotification-container">
        <div className="dashboard-create-notification">
          <div className="create-notification-header">
            <h3>Create Notifications</h3>
            <span>Push to employees or groups</span>
          </div>

          {/* Feedback Modal */}
          <Modal onReady={setShowFeedbackModal} />

          <form onSubmit={handleSubmit}>
            <div className="create-notification-content">
              <div className="create-notification-title">
                <label htmlFor="notificationtitle">NOTIFICATION TITLE</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter notification title"
                  maxLength={120}
                  required
                />
              </div>
              <div className="create-notification-msg">
                <label htmlFor="notificationmsg">MESSAGE</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your notification..."
                  rows={4}
                  maxLength={2000}
                  required
                />
              </div>

              <div className="admin-notification-form__field">
                <NotificationDropdown
                  label="Notification Type"
                  value={form.type}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      type: value,
                    }))
                  }
                  options={[
                    { value: "announcement", label: "Announcement" },
                    { value: "system", label: "System" },
                  ]}
                  placeholder="Select notification type"
                />
              </div>

              <div className="admin-notification-form__field">
                <NotificationDropdown
                  label="Send To"
                  value={form.audienceType}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      audienceType: value,
                      targetDepartment: "",
                      targetDesignation: "",
                      targetUserId: "",
                    }))
                  }
                  options={[
                    { value: "all", label: "All Employees" },
                    { value: "department", label: "Department" },
                    { value: "designation", label: "Designation" },
                    { value: "specific", label: "Specific Employee" },
                  ]}
                  placeholder="Select target audience"
                />
              </div>

              {form.audienceType === "department" && (
                <div className="admin-notification-form__field">
                  <NotificationDropdown
                    label="Department"
                    value={form.targetDepartment}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        targetDepartment: value,
                      }))
                    }
                    options={departments.map((department) => ({
                      value: department,
                      label: department,
                    }))}
                    placeholder="Select department"
                  />
                </div>
              )}

              {form.audienceType === "designation" && (
                <div className="admin-notification-form__field">
                  <NotificationDropdown
                    label="Designation"
                    value={form.targetDesignation}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        targetDesignation: value,
                      }))
                    }
                    options={designations.map((designation) => ({
                      value: designation,
                      label: designation,
                    }))}
                    placeholder="Select designation"
                  />
                </div>
              )}

              {form.audienceType === "specific" && (
                <div className="admin-notification-form__field">
                  <label htmlFor="employee-search">Search Employee</label>

                  <input
                    id="employee-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email, department..."
                  />

                  <NotificationDropdown
                    label="Select Employee"
                    value={form.targetUserId}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        targetUserId: value,
                      }))
                    }
                    placeholder={
                      loadingRecipients
                        ? "Loading employees..."
                        : "Select employee"
                    }
                    disabled={loadingRecipients}
                    options={employees.map((employee) => ({
                      value: employee._id,
                      label: [
                        `${employee.firstName} ${employee.lastName}`.trim(),
                        employee.designation || employee.role || "Employee",
                        employee.department ? `(${employee.department})` : "",
                      ]
                        .filter(Boolean)
                        .join(" — "),
                    }))}
                  />
                </div>
              )}

              <button
                type="submit"
                className="create-notification-btn"
                disabled={sending || loadingRecipients}
              >
                <FaBell style={{ color: "#fff" }} /> 
                <span>{sending ? "Sending..." : "Send Notification"}</span>
              </button>
            </div>
          </form>
        </div>
        <div className="dashboard-recent-notification">
          <div className="recent-notification-header">
            <h3>Recent Notifications</h3>
            <span>3 unread</span>
          </div>
          <div className="recent-notification-content-container">
            {recentNotification &&
              recentNotification.map((el, id) => (
                <div
                  className="recent-notification-content"
                  key={id}
                >
                  <div className="recent-notification-type">
                    <div className="recent-notification-icon">{el.icon}</div>
                    <div className="recent-notification-msg">
                      <p>{el.notificationTitle}</p>
                      <span>{el.time}</span>
                    </div>
                  </div>
                  <PulseDot
                    className="recent-notification-active"
                    color="var(--text_primary)"
                    size="8px"
                    speed="2.5s"
                    scale="2.5"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
