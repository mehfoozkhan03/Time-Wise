import './Home.css'

import HeroSection from '../components/home/HeroSection/HeroSection'
import TodayWork from '../components/home/TodayWork/TodayWork'
import ThoughtCard from '../components/home/ThoughtCard/ThoughtCard'
import QuickActions from '../components/home/QuickActions/QuickActions'
import Performance from '../components/home/Performance/Performance'
import CompanyUpdates from '../components/home/CompanyUpdates/CompanyUpdates'

export default function Home() {
  return (
    <main className="home_page">
      <HeroSection />

      <TodayWork />

      <ThoughtCard />

      <QuickActions />

      <Performance />

      <CompanyUpdates/>
    </main>
  )
}
