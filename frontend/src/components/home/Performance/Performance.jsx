import './Performance.css'
import useCountUp from "../../../components/UseCount/Count";
import { useSelector } from 'react-redux'

import PerformanceCard from './PerformanceCard'

import { FaBullseye, FaClock, FaFire, FaCalendarCheck } from 'react-icons/fa'

export default function Performance() {
  const { stats } = useSelector((state) => state.dashboard)

  const attendanceSubtitle = () => {
    if (stats.attendancePercentage >= 98) return '⭐ Outstanding attendance'

    if (stats.attendancePercentage >= 95) return 'Excellent consistency'

    if (stats.attendancePercentage >= 90) return 'Great attendance'

    if (stats.attendancePercentage >= 80) return 'Good attendance'

    return 'Needs improvement'
  }

  const productivitySubtitle = () => {
    if (stats.productivity >= 95) return '🔥 Exceptional productivity'

    if (stats.productivity >= 85) return '👍 Above average productivity'

    if (stats.productivity >= 70) return '⚡ Consistent performance'

    return '📈 Improving steadily'
  }

  const weeklySubtitle = () => {
    if (stats.weeklyHoursRemaining <= 0) {
      const extra = Math.abs(stats.weeklyHoursRemaining).toFixed(1)

      return extra === '0.0'
        ? 'Weekly goal achieved 🎉'
        : `${extra}h above target 💪`
    }

    return `${stats.weeklyHoursRemaining.toFixed(1)}h left this week`
  }

  const streakSubtitle = () => {
    if (stats.longestStreak > 0 && stats.dayStreak === stats.longestStreak) {
      return '🏆 New personal best!'
    }

    if (
      stats.longestStreak > stats.dayStreak &&
      stats.longestStreak - stats.dayStreak === 1
    ) {
      return '1 day away from your record'
    }

    if (stats.dayStreak >= 5) {
      return '🔥 Keep the momentum going!'
    }

    return `Best: ${stats.longestStreak} days`
  }

  const attendanceColor = () => {
    if (stats.attendancePercentage >= 95) return '#22c55e'
    if (stats.attendancePercentage >= 80) return '#84cc16'
    if (stats.attendancePercentage >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const weeklyColor = () => {
    if (stats.weeklyGoalPercentage >= 100) return '#22c55e'
    if (stats.weeklyGoalPercentage >= 80) return '#8b5cf6'
    return '#29A3E0'
  }

const attendance = useCountUp(stats.attendancePercentage);
const productivity = useCountUp(stats.productivity);
const weeklyHours = useCountUp(stats.weeklyHours);
const dayStreak = useCountUp(stats.dayStreak);

  const performanceStats = [
    {
      title: 'Attendance',

       value: `${attendance}%`,

      subtitle: attendanceSubtitle(),

      progress: stats.attendancePercentage,

      color: attendanceColor(),

      icon: <FaCalendarCheck />,
    },

    {
      title: 'Productivity',

          value: `${productivity}%`,

      subtitle: productivitySubtitle(),

      progress: stats.productivity,

      color: '#29A3E0',

      icon: <FaBullseye />,
    },

    {
      title: 'Weekly Hours',

        value: weeklyHours.toFixed(1),

      subtitle: weeklySubtitle(),

      progress: Math.min(stats.weeklyGoalPercentage, 100),

      color: weeklyColor(),

      icon: <FaClock />,
    },

    {
      title: 'Current Streak',

      value: dayStreak,

      subtitle: streakSubtitle(),

      progress:
        stats.longestStreak === 0
          ? 0
          : Math.min((stats.dayStreak / stats.longestStreak) * 100, 100),

      color: '#f59e0b',

      icon: <FaFire />,
    },
  ]

  return (
    <section className="performance" id="tour-stats-grid">
      <h2>Your Performance</h2>

      <div className="performance_grid">
        {performanceStats.map((stat) => (
          <PerformanceCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  )
}
