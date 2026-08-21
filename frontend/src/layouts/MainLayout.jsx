import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "./../components/Footer/Footer";
import { ActivityTracker } from "../hooks/ActivityTracker";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <ActivityTracker />
      <main className="main_layout">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
