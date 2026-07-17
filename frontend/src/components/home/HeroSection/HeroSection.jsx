import './HeroSection.css'

import Card from '../../Card/Card'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { FaFire, FaCalendarAlt, FaClock } from 'react-icons/fa'
import { data } from 'react-router-dom'

export default function HeroSection() {
  const [time, setTime] = useState(new Date())

  const { user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

const greeting = () => {
  const hour = time.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 20) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

  const capitalize = (text) => {
    if (!text) return ''

    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  if (isLoading) {
    return (
      <section className="hero">
        <div className="hero_left">
          <h1>Loading...</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="hero">
      <div className="hero_left">
        <div id="tour-hero-greeting">
          <h1>
            {greeting()},
            <br />
            {capitalize(user?.firstName) || 'Employee'}.
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
              {time.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
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
  )
}


//morninig=5-12am
//aftrnoon=12pm-5pm
//evening=5pm-8pm
//night=8pm-5am