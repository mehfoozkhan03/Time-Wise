import './EmployeeProfile.css'

import Hero from '../../components/employee/Hero/Hero'
import QuickStats from '../../components/employee/QuickStats/QuickStats'
import Achievements from '../../components/employee/Achievements/Achievements'
import PerformanceSummary from '../../components/employee/PerformanceSummary/PerformanceSummary'
import RecentActivity from '../../components/employee/RecentActivity/RecentActivity'

export default function EmployeeProfile() {
  return (
    <main className="employee_profile">
      <Hero />

      <QuickStats />

      <Achievements />

      <div className="employee_bottom">
        <PerformanceSummary />

        <RecentActivity />
      </div>
    </main>
  )
}
