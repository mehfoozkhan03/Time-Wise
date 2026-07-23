import './QuickStats.css'

import { useSelector } from 'react-redux'

import Card from '../../Card/Card'

import { FaCalendarCheck, FaBullseye, FaFire, FaClock } from 'react-icons/fa'

export default function QuickStats() {
  const { stats } = useSelector((state) => state.dashboard)

  const quickStats = [
    {
      title: 'Attendance',
      value: `${stats.attendancePercentage}%`,
      icon: <FaCalendarCheck />,
      color: '#22c55e',
    },
    {
      title: 'Work Efficiency',
      value: `${stats.productivity}%`,
      icon: <FaBullseye />,
      color: '#29A3E0',
    },
    {
      title: 'Monthly Hours',
      value: `${stats.monthlyHours}h`,
      icon: <FaClock />,
      color: '#8b5cf6',
    },
    {
      title: 'Current Streak',
      value: `${stats.dayStreak} Days`,
      icon: <FaFire />,
      color: '#f59e0b',
    },
  ]

  return (
    <section className="profile_stats">
      {quickStats.map((stat) => (
        <Card className="profile_stat_card" key={stat.title}>
          <div
            className="profile_stat_icon"
            style={{
              background: `${stat.color}20`,
              color: stat.color,
            }}
          >
            {stat.icon}
          </div>

          <div className="profile_stat_content">
            <span>{stat.title}</span>

            <h2>{stat.value}</h2>
          </div>
        </Card>
      ))}
    </section>
  )
}
