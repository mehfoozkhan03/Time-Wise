import './Home.css'
import { useNavigate } from 'react-router-dom'

import HeroSection from '../components/home/HeroSection/HeroSection'
import TodayWork from '../components/home/TodayWork/TodayWork'
import ThoughtCard from '../components/home/ThoughtCard/ThoughtCard'
import QuickActions from '../components/home/QuickActions/QuickActions'
import Performance from '../components/home/Performance/Performance'
import CompanyUpdates from '../components/home/CompanyUpdates/CompanyUpdates'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="home_page">
      <HeroSection />

      <TodayWork />

      <ThoughtCard />

      <QuickActions />

      <Performance />

      <CompanyUpdates />

      <button className="signup_btn" onClick={() => navigate('/signup')}>
        Sign Up
      </button>
    </main>
  )
}
