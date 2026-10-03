import "./AnnouncementForm.css";
import { Modal } from "../../../Modal/Modal";
import { AnnoucementDropdown } from "../AnnoucementDropdown/AnnoucementDropdown";

import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  createAnnouncement,
  updateAnnouncement,
} from "./../../../../store/announcementSlice";

export const AnnouncementForm = ({
  onClose,
  mode = "create",
  announcement = null,
}) => {
  const dispatch = useDispatch();

  const { createLoading, error } = useSelector((state) => state.announcement);

  const categoriesOpt = [
    "Company",
    "Holiday",
    "Policy",
    "Event",
    "Important",
    "HR",
    "Attendance",
    "Training",
    "Payroll",
    "Maintenance",
  ];

  const [formData, setFormData] = useState({
    title: "",
    category: "Company",
    priority: "Normal",
    description: "",

    status: "Published",
    publishedAt: null,
    scheduledAt: null,

    expiryDate: "",
    expiryTime: "",

    audience: "Everyone",
    department: "",
    role: "",
    specificEmployees: [],

    attachments: [],

    actionButton: {
      enabled: false,
      label: "",
      url: "",
    },

    isPinned: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //# This is for edit form

  const saveAnnouncement = async (status) => {
    if (!formData.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter announcement description.");
      return;
    }

    const data = {
      ...formData,

      title: formData.title.trim(),
      description: formData.description.trim(),

      status,

      publishedAt: status === "Published" ? new Date().toISOString() : null,

      scheduledAt: status === "Scheduled" ? formData.scheduledAt : null,

      department:
        formData.audience === "Department" ? formData.department || null : null,

      role: formData.audience === "Role" ? formData.role || null : null,

      specificEmployees:
        formData.audience === "Specific Employees"
          ? formData.specificEmployees
          : [],

      actionButton: {
        enabled: formData.actionButton.enabled,
        label: formData.actionButton.enabled
          ? formData.actionButton.label
          : null,
        url: formData.actionButton.enabled ? formData.actionButton.url : null,
      },

      isPinned: formData.isPinned,
    };

    try {
      if (mode === "edit") {
        await dispatch(
          updateAnnouncement({
            id: announcement._id,
            data,
          }),
        ).unwrap();
      } else {
        await dispatch(createAnnouncement(data)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Save announcement error:", error);
    }
  };

  const handlePublish = () => {
    saveAnnouncement("Published");
  };

  const handleSaveDraft = () => {
    saveAnnouncement("Draft");
  };

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    if (!formData.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter announcement description.");
      return;
    }

    setShowPreview(true);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  //# This is for edit
  useEffect(() => {
    if (mode === "edit" && announcement) {
      setFormData({
        title: announcement.title || "",
        category: announcement.category || "Company",
        priority: announcement.priority || "Normal",
        description: announcement.description || "",

        status: announcement.status || "Draft",
        publishedAt: announcement.publishedAt || null,
        scheduledAt: announcement.scheduledAt || null,

        expiryDate: announcement.expiryDate
          ? new Date(announcement.expiryDate).toISOString().split("T")[0]
          : "",

        expiryTime: announcement.expiryTime || "",

        audience: announcement.audience || "Everyone",

        department:
          typeof announcement.department === "object"
            ? announcement.department?._id || ""
            : announcement.department || "",

        role: announcement.role || "",

        specificEmployees:
          announcement.specificEmployees?.map((employee) =>
            typeof employee === "object" ? employee._id : employee,
          ) || [],

        attachments: announcement.attachments || [],

        actionButton: {
          enabled: announcement.actionButton?.enabled || false,
          label: announcement.actionButton?.label || "",
          url: announcement.actionButton?.url || "",
        },

        isPinned: announcement.isPinned || false,
      });
    }
  }, [mode, announcement]);

  return (
    <Modal
      isOpen
      overlayClassName="announcementForm-overlay"
      className="announcementForm-section"
    >
      <div className="announcementForm-container">
        <div className="announcementForm-heading">
          <h3>
            {mode === "edit" ? "Edit Announcement" : "Create New Announcement"}
          </h3>
          <div
            className="close-announcementForm"
            onClick={onClose}
          >
            x
          </div>
        </div>

        {/* Basic Information */}
        <div className="announcementForm-basinInformation">
          <h3>BASIC INFORMATION</h3>
          <div className="basinInformation-content">
            <div>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Announcement Title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="basinInformation-category">
              <div>
                <label htmlFor="category">Category</label>
                <AnnoucementDropdown
                  options={categoriesOpt}
                  value={formData.category}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                  className="basinInformation-category-dropdown"
                />
              </div>
              <div className="basinInformation-priority">
                <label htmlFor="priority">Priority</label>
                <div>
                  {["Normal", "Important", "Urgent"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={formData.priority === item ? "active" : ""}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: item,
                        }))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="basinInformation-description">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                rows="6"
                placeholder="Write your announcement here..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="announcementForm-publishing">
          <div className="announcementForm-publish-content">
            <h3>PUBLISHING</h3>
            <div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    status: "Draft",
                  }))
                }
                className={formData.status === "Draft" ? "active" : ""}
              >
                Draft
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    status: "Published",
                  }))
                }
                className={formData.status === "Published" ? "active" : ""}
              >
                Publish Now
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    status: "Scheduled",
                  }))
                }
                className={formData.status === "Scheduled" ? "active" : ""}
              >
                Schedule
              </button>
            </div>
          </div>
          <div className="announcementForm-expiry">
            <div>
              <h3>Expiry Date(Optional)</h3>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3>Expiry Time</h3>
              <input
                type="time"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Audience */}
        <div className="announcementForm-audience">
          <div className="announcementForm-audience-heading">
            <h3>AUDIENCE</h3>
            <span>Who should receive this announcement?</span>
          </div>
          <div className="announcementForm-audience-type">
            {["Everyone", "Department", "Role", "Specific Employees"].map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  className={formData.audience === item ? "active" : ""}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      audience: item,
                    }))
                  }
                >
                  {item}
                </button>
              ),
            )}
            {formData.audience === "Department" && (
              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
              />
            )}

            {formData.audience === "Role" && (
              <input
                type="text"
                name="role"
                placeholder="Enter role"
                value={formData.role}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        {/* Attachements */}
        <div className="announcementForm-attachements">
          <label className="attachment-label">ATTACHMENTS</label>
          <div>
            <input
              type="file"
              multiple
              hidden
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
            />

            <div className="announcementAttachment-upload-icon">
              <FaUpload />
            </div>

            <div className="upload-main-text">Drag & drop files here</div>

            <div className="upload-browse">
              or <span>Browse files</span>
            </div>

            <div className="upload-types">PDF, DOC, DOCX, XLSX, JPG, PNG</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="announcementForm-action">
          <h3>Action Button</h3>

          <div className="announcementForm-action-toggle">
            <div
              className={`announcementForm-switchBtn ${
                formData.actionButton.enabled ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  actionButton: {
                    ...prev.actionButton,
                    enabled: !prev.actionButton.enabled,
                  },
                }))
              }
            >
              <div></div>
            </div>

            <span>Add action button</span>
          </div>

          {formData.actionButton.enabled && (
            <div className="announcementForm-action-fields">
              <input
                type="text"
                placeholder="Button Label"
                value={formData.actionButton.label}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    actionButton: {
                      ...prev.actionButton,
                      label: e.target.value,
                    },
                  }))
                }
              />

              <input
                type="url"
                placeholder="Button URL"
                value={formData.actionButton.url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    actionButton: {
                      ...prev.actionButton,
                      url: e.target.value,
                    },
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* Pin */}
        <div className="announcementForm-pin">
          <h3>PIN</h3>

          <div className="announcementForm-pin-content">
            <div
              className={`announcementForm-switchBtn ${
                formData.isPinned ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isPinned: !prev.isPinned,
                }))
              }
            >
              <div></div>
            </div>

            <div>
              <p>Pin this announcement</p>

              <span>
                Pinned announcements appear at the top of the announcement list.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement form footer */}
      <div className="announcementForm-footer">
        {error && <div className="announcement-form-error">{error}</div>}
        <div>
          <div onClick={onClose}>Cancel</div>
          <div onClick={handleSaveDraft}>Save Draft</div>
          <div onClick={handlePreview}>Preview</div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={createLoading}
        >
          {createLoading
            ? mode === "edit"
              ? "Saving..."
              : "Publishing..."
            : mode === "edit"
              ? "Save Changes"
              : "Publish Announcement"}
        </button>
      </div>

      {showPreview && (
        <Modal
          isOpen
          overlayClassName="announcement-preview-overlay"
          className="announcement-preview"
        >
          <div className="announcement-preview-header">
            <h3>Announcement Preview</h3>

            <button
              type="button"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
          </div>

          <div className="announcement-preview-content">
            <div className="announcement-preview-meta">
              <span>{formData.category}</span>
              <span>{formData.priority}</span>
            </div>

            <h2>{formData.title}</h2>

            <p>{formData.description}</p>

            {formData.actionButton.enabled && formData.actionButton.label && (
              <button
                type="button"
                onClick={() => {
                  if (formData.actionButton.url) {
                    window.open(
                      formData.actionButton.url,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }
                }}
              >
                {formData.actionButton.label}
              </button>
            )}

            {formData.isPinned && (
              <span className="announcement-preview-pinned">📌 Pinned</span>
            )}
          </div>

          <div className="announcement-preview-footer">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
