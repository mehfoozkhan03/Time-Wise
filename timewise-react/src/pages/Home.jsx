import './Home.css'

import HeroSection from '../components/home/HeroSection/HeroSection'
import StatsGrid from '../components/home/StatsGrid/StatsGrid'
import ThoughtCard from '../components/home/ThoughtCard/ThoughtCard'

export default function Home() {
  return (
    <div className="container home_page">
      <HeroSection />

      <StatsGrid />

      <ThoughtCard />
    </div>
  )
}
