import "./EventForm.css";

import { memo, useState, useEffect, useCallback } from "react";

import EventFormFields from "./EventFormFields";

import { EVENT_TYPES } from "../../../data/eventTypes";

const INITIAL_FORM = {
  title: "",
  description: "",
  type: EVENT_TYPES.WORK_EVENT,
  date: "",
  startTime: "",
  endTime: "",
  isAllDay: false,
  location: "",
  priority: "MEDIUM",
  employeeId: "",
};

const normalizeDate = (date) => {
  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    return date.includes("T") ? date.split("T")[0] : date;
  }

  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return "";
};

function EventForm({
  mode = "CREATE",
  initialData = null,
  employees = [],
  isAdmin = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "EDIT" && initialData) {
      setFormData({
        ...INITIAL_FORM,

        title: initialData.title || "",

        description: initialData.description || "",

        type: initialData.type || EVENT_TYPES.WORK_EVENT,

        date: normalizeDate(initialData.date),

        startTime: initialData.startTime || "",

        endTime: initialData.endTime || "",

        isAllDay:
          typeof initialData.isAllDay === "boolean"
            ? initialData.isAllDay
            : false,

        location: initialData.location || "",

        priority: initialData.priority || "MEDIUM",

        employeeId:
          typeof initialData.employeeId === "object"
            ? initialData.employeeId?._id || ""
            : initialData.employeeId || "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }

    setErrors({});
  }, [mode, initialData]);

  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;

      setFormData((previous) => {
        const updatedData = {
          ...previous,

          [name]: type === "checkbox" ? checked : value,
        };

        if (name === "isAllDay" && checked) {
          updatedData.startTime = "";
          updatedData.endTime = "";
        }

        return updatedData;
      });

      if (errors[name]) {
        setErrors((previous) => ({
          ...previous,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title = "Title is required.";
    }

    if (!formData.date) {
      validationErrors.date = "Date is required.";
    }

    if (isAdmin && !formData.employeeId) {
      validationErrors.employeeId = "Employee is required.";
    }

    if (
      !formData.isAllDay &&
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      validationErrors.endTime = "End time must be later than start time.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [formData, isAdmin]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      const payload = {
        ...formData,
      };

      if (payload.isAllDay) {
        payload.startTime = "";
        payload.endTime = "";
      }

      onSubmit?.(payload);
    },
    [formData, isSubmitting, onSubmit, validateForm],
  );

  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      onCancel?.();
    }
  }, [isSubmitting, onCancel]);

  return (
    <form className="eventForm" onSubmit={handleSubmit} noValidate>
      <EventFormFields
        formData={formData}
        errors={errors}
        onChange={handleChange}
        employees={employees}
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
      />

      <div className="formActions">
        <button
          type="button"
          className="cancelBtn"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button type="submit" className="saveBtn" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "EDIT"
              ? "Updating..."
              : "Creating..."
            : mode === "EDIT"
              ? "Update Event"
              : "Create Event"}
        </button>
      </div>
    </form>
  );
}

EventForm.displayName = "EventForm";

export default memo(EventForm);
