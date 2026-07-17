import './Home.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import HeroSection from '../components/home/HeroSection/HeroSection'
import TodayWork from '../components/home/TodayWork/TodayWork'
import QuickActions from '../components/home/QuickActions/QuickActions'
import Performance from '../components/home/Performance/Performance'
import CompanyUpdates from '../components/home/CompanyUpdates/CompanyUpdates'
import FeaturedThought from '../components/home/FeaturedThought/FeaturedThought'

import { fetchCurrentUser } from '../store/authSlice'
import { fetchFeaturedThought } from '../store/postSlice'

export default function Home() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
    dispatch(fetchFeaturedThought())
  }, [dispatch])

  return (
    <main className="home_page">
      <HeroSection />

      <TodayWork />

      <FeaturedThought />

      <QuickActions />

      <Performance />

      <CompanyUpdates />

      <button className="signup_btn" onClick={() => navigate('/signup')}>
        Sign Up
      </button>
    </main>
  )
}
