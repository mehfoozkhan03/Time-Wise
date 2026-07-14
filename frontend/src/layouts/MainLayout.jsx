import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main_layout">
        <Outlet />
      </main>

      <Footer />
      
    </>
  )
}
