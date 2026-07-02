import './StatsGrid.css'

import { FaBullseye, FaUserCheck, FaClock, FaFire } from 'react-icons/fa'

import StatCard from '../../StatCard/StatCard'

export default function StatsGrid() {
  const stats = [
    {
      title: 'Productivity',
      value: '89%',
      subtitle: '+5% from last week',
      progress: 89,
      icon: <FaBullseye />,
    },
    {
      title: 'Attendance',
      value: '97%',
      subtitle: 'Excellent',
      progress: 97,
      icon: <FaUserCheck />,
    },
    {
      title: 'Weekly Hours',
      value: '39.2h',
      subtitle: '98% Goal Completed',
      progress: 98,
      icon: <FaClock />,
    },
    {
      title: 'Current Streak',
      value: '12 Days',
      subtitle: 'Personal Best',
      progress: 82,
      icon: <FaFire />,
    },
  ]

  return (
    <section className="stats_grid" id='tour-stats-grid'>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  )
}
