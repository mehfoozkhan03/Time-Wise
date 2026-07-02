import "./HeroSection.css";

import Card from "../../Card/Card";

import { useState, useEffect } from "react";

import { FaFire, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function HeroSection() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const greeting = () => {
    const hour = time.getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";

    return "Good Evening";
  };

  return (
    <section className="hero">
      <div className="hero_left">
        <div id="tour-hero-greeting">
          <h1>
            {greeting()},
            <br />
            Arnav.
          </h1>

          <p>Let's make today productive.</p>
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

            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <Card className="hero_right">
        <div className="hero_stat">
          <FaFire className="fire" />

          <div id="tour-hero-stat">
            <h2>12</h2>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="hero_progress" id="tour-hero-progress">
          <div>
            <span>Attendance</span>
            <strong>97%</strong>
          </div>

          <div>
            <span>Weekly Hours</span>
            <strong>39.2h</strong>
          </div>

          <div>
            <span>Productivity</span>
            <strong>89%</strong>
          </div>
        </div>
      </Card>
    </section>
  );
}
