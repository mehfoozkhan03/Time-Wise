
import "./BirthdayCelebration.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../store/calendarSlice";

export default function BirthdayCelebration({ isAdmin = false }) {
  const dispatch = useDispatch();

  const { events = [] } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [hasCheckedBirthday, setHasCheckedBirthday] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const authType = isAdmin ? "admin" : "user";

  /* =========================================
     FETCH BIRTHDAY EVENTS
  ========================================= */

  useEffect(() => {
    let isActive = true;

    dispatch(fetchEvents({ authType }))
      .unwrap()
      .then(() => {
        if (isActive) {
          setEventsLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch birthday events:", error);

        if (isActive) {
          setEventsLoaded(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [dispatch, authType]);

  /* =========================================
     CHECK BIRTHDAY ONLY ONCE
  ========================================= */

  useEffect(() => {
    if (!eventsLoaded || hasCheckedBirthday || !Array.isArray(events)) {
      return;
    }

    // Wait until employee details are available.
    if (!isAdmin && !user?._id) {
      return;
    }

    const today = new Date();

    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    const isBirthday = events.some((event) => {
      if (event?.type !== "BIRTHDAY" || !event?.date) {
        return false;
      }

      const birthdayDate = String(event.date).slice(0, 10);
      const [, month, day] = birthdayDate.split("-").map(Number);

      if (!month || !day) {
        return false;
      }

      const matchesToday = month === todayMonth && day === todayDate;

      if (!matchesToday) {
        return false;
      }

      if (isAdmin) {
        return event.createdByModel === "Admin" && !event.employeeId;
      }

      const employeeId =
        typeof event.employeeId === "object"
          ? event.employeeId?._id
          : event.employeeId;

      return employeeId === user._id;
    });

    setIsOpen(isBirthday);
    setHasCheckedBirthday(true);
  }, [eventsLoaded, hasCheckedBirthday, events, user, isAdmin]);

  /* =========================================
     CLOSE CELEBRATION
  ========================================= */

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="birthdayOverlay">
      <div
        className="birthdayModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="birthdayTitle"
      >
        <button
          type="button"
          className="birthdayClose"
          onClick={handleClose}
          aria-label="Close birthday celebration"
        >
          &times;
        </button>

        <div className="birthdayIcon" aria-hidden="true">
          🎂
        </div>

        <div className="birthdayConfetti" aria-hidden="true">
          🎉 ✨ 🎈
        </div>

        <h2 id="birthdayTitle">Happy Birthday!</h2>

        <p>
          Wishing you a wonderful birthday filled with happiness, success, and
          beautiful memories.
        </p>

        <div className="birthdayFooter">
          <span>Have an amazing day!</span>
        </div>

        <button
          type="button"
          className="birthdayCelebrateBtn"
          onClick={handleClose}
        >
          Thank You!
        </button>
      </div>
    </div>
  );
}
