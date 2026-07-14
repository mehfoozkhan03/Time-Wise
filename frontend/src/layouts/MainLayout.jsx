import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main_layout">
        <Outlet />
      </main>

      <Footer />
      
    </>
  );
}
