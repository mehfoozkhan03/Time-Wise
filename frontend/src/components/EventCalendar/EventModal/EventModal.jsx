import "./EventModal.css";

import {
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { EVENT_CONFIG } from "../data/eventConfig";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const config = EVENT_CONFIG[event.type];

  return (
    <div
      className="eventModalOverlay"
      onClick={onClose}
    >
      <div
        className="eventModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">

          <h2>Event Details</h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>

        </div>

        <div className="modalBody">

          <div className="eventHeading">

            <span className="eventEmoji">
              {config.icon}
            </span>

            <div>

              <h3>{event.title}</h3>

              <span className="eventTypeBadge">
                {config.label}
              </span>

            </div>

          </div>

          <div className="modalInfo">

            <div className="infoRow">

              <FaUser className="infoIcon" />

              <div>

                <span>Employee</span>

                <p>{event.employee || "N/A"}</p>

              </div>

            </div>

            <div className="infoRow">

              <FaBuilding className="infoIcon" />

              <div>

                <span>Department</span>

                <p>{event.department || "N/A"}</p>

              </div>

            </div>

            <div className="infoRow">

              <FaCalendarAlt className="infoIcon" />

              <div>

                <span>Date</span>

                <p>{event.date}</p>

              </div>

            </div>

            <div className="infoRow">

              <FaClock className="infoIcon" />

              <div>

                <span>Time</span>

                <p>

                  {event.startTime || "--"}

                  {event.endTime && ` - ${event.endTime}`}

                </p>

              </div>

            </div>

            <div className="infoRow">

              <FaTag className="infoIcon" />

              <div>

                <span>Type</span>

                <p>{config.label}</p>

              </div>

            </div>

          </div>

          <div className="description">

            <h4>Description</h4>

            <p>

              {event.description || "No description available."}

            </p>

          </div>

        </div>

        <div className="modalFooter">

          <button className="editBtn">

            <FaEdit />

            Edit

          </button>

          <button className="deleteBtn">

            <FaTrash />

            Delete

          </button>

        </div>

      </div>
    </div>
  );
}