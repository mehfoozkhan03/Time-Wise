import "./EventModal.css";

import {
    memo,
    useCallback,
    useEffect,
} from "react";

import {
    FaTimes,
    FaEdit,
    FaTrash,
    FaUser,
    FaBuilding,
    FaCalendarAlt,
    FaClock,
    FaTag,
} from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import {
    formatFullDate,
    formatTime,
} from "../../../utils/dateUtils";

import InfoRow from "../../Common/InfoRow/InfoRow";

function EventModal({
    event,
    onClose,
}) {
    useEffect(() => {
        if (!event) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [event, onClose]);

    const handleOverlayClick = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleModalClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    if (!event) return null;

    const config = EVENT_CONFIG[event.type];

    if (!config) return null;

    const Icon = config.icon;

    return (
        <div
            className="eventModalOverlay"
            onClick={handleOverlayClick}
            role="presentation"
        >
            <div
                className="eventModal"
                onClick={handleModalClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="event-modal-title"
            >
                {/* Header */}

                <div className="modalHeader">
                    <div className="modalTitle">
                        <div
                            className="eventIcon"
                            style={{
                                "--event-color":
                                    config.color,
                            }}
                        >
                            <Icon />
                        </div>

                        <div>
                            <h2 id="event-modal-title">
                                {event.title}
                            </h2>

                            <span
                                className="eventType"
                                style={{
                                    "--event-color":
                                        config.color,
                                }}
                            >
                                {config.label}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="closeBtn"
                        aria-label="Close event details"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}

                <div className="modalBody">
                    <InfoRow
                        icon={FaUser}
                        label="Employee"
                        value={event.employee}
                    />

                    <InfoRow
                        icon={FaBuilding}
                        label="Department"
                        value={event.department}
                    />

                    <InfoRow
                        icon={FaCalendarAlt}
                        label="Date"
                        value={formatFullDate(
                            event.date
                        )}
                    />

                    <InfoRow
                        icon={FaClock}
                        label="Time"
                        value={`${formatTime(
                            event.startTime
                        )} - ${formatTime(
                            event.endTime
                        )}`}
                    />

                    <InfoRow
                        icon={FaTag}
                        label="Event Type"
                        value={config.label}
                    />

                    <div className="descriptionCard">
                        <h3>Description</h3>

                        <p>
                            {event.description ||
                                "No description available."}
                        </p>
                    </div>
                </div>

                {/* Footer */}

                <div className="modalFooter">
                    <button
                        type="button"
                        className="editBtn"
                    >
                        <FaEdit />
                        Edit
                    </button>

                    <button
                        type="button"
                        className="deleteBtn"
                    >
                        <FaTrash />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(EventModal);