import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AdminFooter from "../components/AdminFooter/AdminFooter";

import { ActivityTracker } from "../hooks/ActivityTracker";
import { ThemeApplier } from "../ThemeApplier/ThemeApplier";

export default function MainLayout() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/adminDashboard");

  return (
    <>
      <ThemeApplier />
      <Navbar />
      {!isAdminPage && <ActivityTracker />}

      <main className="main_layout">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
