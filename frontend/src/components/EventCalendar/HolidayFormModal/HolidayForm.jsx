import "./HolidayForm.css";

import { memo, useState, useEffect, useCallback } from "react";

import { EVENT_TYPES } from "../../../data/eventTypes";

const INITIAL_FORM = {
  title: "",
  description: "",
  type: EVENT_TYPES.HOLIDAY,
  date: "",
  priority: "MEDIUM",
  visibility: "PUBLIC",
  isActive: true,
};

const HOLIDAY_TYPES = [
  {
    value: EVENT_TYPES.HOLIDAY,
    label: "Holiday",
  },
  {
    value: EVENT_TYPES.FESTIVAL,
    label: "Festival",
  },
  {
    value: EVENT_TYPES.GOVERNMENT_HOLIDAY,
    label: "Government Holiday",
  },
  {
    value: EVENT_TYPES.COMPANY_HOLIDAY,
    label: "Company Holiday",
  },
  {
    value: EVENT_TYPES.OPTIONAL_HOLIDAY,
    label: "Optional Holiday",
  },
  {
    value: EVENT_TYPES.OBSERVANCE,
    label: "Observance",
  },
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const VISIBILITY = ["PUBLIC", "PRIVATE"];

function HolidayForm({
  mode = "CREATE",
  initialData = null,
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
        type: initialData.type || EVENT_TYPES.HOLIDAY,
        date: initialData.date || "",
        priority: initialData.priority || "MEDIUM",
        visibility: initialData.visibility || "PUBLIC",
        isActive:
          typeof initialData.isActive === "boolean"
            ? initialData.isActive
            : true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }

    setErrors({});
  }, [mode, initialData]);

  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;

      setFormData((previous) => ({
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      }));

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
      validationErrors.title = "Holiday title is required.";
    }

    if (!formData.date) {
      validationErrors.date = "Holiday date is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      onSubmit?.({
        ...formData,
      });
    },
    [formData, isSubmitting, onSubmit, validateForm],
  );

  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      onCancel?.();
    }
  }, [isSubmitting, onCancel]);

  return (
    <form className="holidayForm" onSubmit={handleSubmit} noValidate>
      <div className="formGroup">
        <label htmlFor="title">Holiday Title *</label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter holiday title"
          disabled={isSubmitting}
          required
        />

        {errors.title && <small className="errorText">{errors.title}</small>}
      </div>

      <div className="formGroup">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          disabled={isSubmitting}
        />
      </div>

      <div className="formGrid">
        <div className="formGroup">
          <label htmlFor="type">Holiday Type</label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {HOLIDAY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="date">Date *</label>

          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          {errors.date && <small className="errorText">{errors.date}</small>}
        </div>
      </div>

      <div className="formGrid">
        <div className="formGroup">
          <label htmlFor="priority">Priority</label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="visibility">Visibility</label>

          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {VISIBILITY.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="checkboxGroup">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          Active Holiday
        </label>
      </div>

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
              ? "Update Holiday"
              : "Create Holiday"}
        </button>
      </div>
    </form>
  );
}

HolidayForm.displayName = "HolidayForm";

export default memo(HolidayForm);
