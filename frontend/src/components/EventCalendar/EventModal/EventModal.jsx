import "./EventModal.css";

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

export default function EventModal({

    event,

    onClose,

}) {

    if (!event) return null;

    const config = EVENT_CONFIG[event.type];

    const Icon = config.icon;

    return (

        <div

            className="eventModalOverlay"

            onClick={onClose}

        >

            <div

                className="eventModal"

                onClick={(e) => e.stopPropagation()}

            >

                {/* Header */}

                <div className="modalHeader">

                    <div className="modalTitle">

                        <div

                            className="eventIcon"

                            style={{

                                "--event-color": config.color,

                            }}

                        >

                            <Icon />

                        </div>

                        <div>

                            <h2>

                                {event.title}

                            </h2>

                            <span

                                className="eventType"

                                style={{

                                    "--event-color": config.color,

                                }}

                            >

                                {config.label}

                            </span>

                        </div>

                    </div>

                    <button

                        className="closeBtn"

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

                        value={formatFullDate(event.date)}

                    />

                    <InfoRow

                        icon={FaClock}

                        label="Time"

                        value={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}

                    />

                    <InfoRow

                        icon={FaTag}

                        label="Event Type"

                        value={config.label}

                    />

                    <div className="descriptionCard">

                        <h3>

                            Description

                        </h3>

                        <p>

                            {event.description ||

                                "No description available."}

                        </p>

                    </div>

                </div>

                {/* Footer */}

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