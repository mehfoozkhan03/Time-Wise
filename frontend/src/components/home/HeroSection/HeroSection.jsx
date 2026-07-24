import "./HeroSection.css";
import useCountUp from "../../../components/UseCount/Count";
import Card from "../../Card/Card";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../../store/dashboardSlice";

import { FaFire, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function HeroSection() {
  const dispatch = useDispatch();

  const [time, setTime] = useState(new Date());

  const { user, isLoading } = useSelector((state) => state.auth);

  const [displayText, setDisplayText] = useState("");

  const [translations, setTranslations] = useState([]);

  const [languageIndex, setLanguageIndex] = useState(0);

  const [isDeleting, setIsDeleting] = useState(false);

  const [charIndex, setCharIndex] = useState(0);

  const languages = ["en", "hi", "mr", "gr", "ta", "te", "kn", "ml", "bn"];

  const greeting = () => {
    const hour = time.getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 20) return "Good Evening";

    return "Good Night";
  };

  const stats = useSelector((state) => state.dashboard?.stats) || {
    dayStreak: 0,
    longestStreak: 0,
    attendancePercentage: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    productivity: 0,
    weeklyTarget: 40,
    weeklyHoursRemaining: 40,
    weeklyGoalPercentage: 0,
    averageCheckIn: "--:--",
    averageBreakDuration: 0,
  };

  useEffect(() => {
    if (!translations.length) return;

    const text = translations[languageIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < text.length) {
            setDisplayText(text.substring(0, charIndex + 1));
            setCharIndex((prev) => prev + 1);
          } else {
            setTimeout(() => {
              setIsDeleting(true);
            }, 1500);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(text.substring(0, charIndex - 1));
            setCharIndex((prev) => prev - 1);
          } else {
            setIsDeleting(false);
            setLanguageIndex((prev) => (prev + 1) % translations.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, languageIndex, translations]);

  const translateGreeting = async () => {
    const text = currentGreeting;

    try {
      const translated = await Promise.all(
        languages.map(async (lang) => {
          if (lang === "en") return text;

          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(
              text,
            )}`,
          );

          const data = await response.json();

          return data[0][0][0];
        }),
      );

      setTranslations(translated);
      setLanguageIndex(0);
    } catch (err) {
      console.error(err);
      setTranslations([text]);
    }
  };

  const currentGreeting = greeting();

  useEffect(() => {
    translateGreeting();
  }, [currentGreeting]);

  useEffect(() => {
    setCharIndex(0);
    setDisplayText("");
    setIsDeleting(false);
  }, [languageIndex]);

  const attendance = useCountUp(stats.attendancePercentage);
  const weeklyHours = useCountUp(stats.weeklyHours);
  const productivity = useCountUp(stats.productivity);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const capitalize = (text) => {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (isLoading) {
    return (
      <section className="hero">
        <div className="hero_left">
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero_left">
        <div id="tour-hero-greeting">
          <h1>
            {displayText}
            <span className="typing-cursor">|</span>
          </h1>
          <h1 className="hero_name">
            {capitalize(user?.firstName) || "Employee"}.
          </h1>

          <p>
            {user?.designation && user?.department
              ? `${user.designation} • ${user.department}`
              : "Let's make today productive."}
          </p>
        </div>

        <div className="hero_info" id="tour-hero-info">
          <div>
            <FaCalendarAlt />
            <span>
              {time.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div>
            <FaClock />
            <span>
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </div>

      <Card className="hero_right">
        <div className="hero_stat" id="tour-hero-stat">
          <FaFire className="fire" />
          <div>
            <h2>{stats.dayStreak}</h2>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="hero_progress" id="tour-hero-progress">
          <div>
            <span>Attendance</span>
            <strong>{attendance}%</strong>
          </div>
          <div>
            <span>Weekly Hours</span>
            <strong>{weeklyHours}h</strong>
          </div>
          <div>
            <span>Productivity</span>
            <strong>{productivity}%</strong>
          </div>
        </div>
      </Card>
    </section>
  );
}
