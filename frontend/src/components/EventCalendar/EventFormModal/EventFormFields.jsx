import "./EventForm.css";

import { memo } from "react";

import { EVENT_TYPES } from "../../../data/eventTypes";

const EVENT_OPTIONS = [
  {
    value: EVENT_TYPES.LEAVE,
    label: "Leave",
  },
  {
    value: EVENT_TYPES.WORK_EVENT,
    label: "Work Event",
  },
  {
    value: EVENT_TYPES.SPECIAL_EVENT,
    label: "Special Event",
  },
  {
    value: EVENT_TYPES.PERSONAL,
    label: "Personal",
  },
  {
    value: EVENT_TYPES.MEETING,
    label: "Meeting",
  },
  {
    value: EVENT_TYPES.REVIEW,
    label: "Review",
  },
  {
    value: EVENT_TYPES.DEADLINE,
    label: "Deadline",
  },
  {
    value: EVENT_TYPES.TRAINING,
    label: "Training",
  },
  {
    value: EVENT_TYPES.CLIENT_MEETING,
    label: "Client Meeting",
  },
];

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

function EventFormFields({
  formData,
  errors = {},
  onChange,
  employees = [],
  isAdmin = false,
  isSubmitting = false,
}) {
  return (
    <>
      {isAdmin && (
        <div className="formGroup">
          <label htmlFor="employeeId">Assign Employee *</label>

          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={onChange}
            disabled={isSubmitting}
            required={isAdmin}
          >
            <option value="">
              {employees.length ? "Select Employee" : "No Employees Found"}
            </option>

            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>

          {errors.employeeId && (
            <small className="errorText">{errors.employeeId}</small>
          )}
        </div>
      )}

      <div className="formGroup">
        <label htmlFor="title">Title *</label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={onChange}
          placeholder="Enter title"
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
          onChange={onChange}
          placeholder="Enter description"
          disabled={isSubmitting}
        />
      </div>

      <div className="formGroup">
        <label htmlFor="type">Event Type</label>

        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={onChange}
          disabled={isSubmitting}
        >
          {EVENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="date">Date *</label>

          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={onChange}
            disabled={isSubmitting}
            required
          />

          {errors.date && <small className="errorText">{errors.date}</small>}
        </div>

        <div className="formGroup checkboxGroup">
          <label>
            <input
              type="checkbox"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={onChange}
              disabled={isSubmitting}
            />
            All Day
          </label>
        </div>
      </div>

      {!formData.isAllDay && (
        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="startTime">Start Time</label>

            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={onChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="endTime">End Time</label>

            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={onChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      <div className="formGroup">
        <label htmlFor="location">Location</label>

        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={onChange}
          placeholder="Enter location"
          disabled={isSubmitting}
        />
      </div>

      <div className="formGroup">
        <label htmlFor="priority">Priority</label>

        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={onChange}
          disabled={isSubmitting}
        >
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

EventFormFields.displayName = "EventFormFields";

export default memo(EventFormFields);