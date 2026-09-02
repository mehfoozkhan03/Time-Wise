// import { Outlet } from "react-router-dom";

// import Navbar from "../components/Navbar/Navbar";
// import Footer from "./../components/Footer/Footer";
// import { ActivityTracker } from "../hooks/ActivityTracker";

// export default function MainLayout() {
//   return (
//     <>
//       <Navbar />
//       <ActivityTracker />
//       <main className="main_layout">
//         <Outlet />
//       </main>

//       <Footer />
//     </>
//   );
// }


import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AdminFooter from "../components/AdminFooter/AdminFooter";

import { ActivityTracker } from "../hooks/ActivityTracker";

export default function MainLayout() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/adminDashboard");

  return (
    <>
        <Navbar />
      {!isAdminPage && <ActivityTracker />}

      <main className="main_layout">
        <Outlet />
      </main>


      {isAdminPage ? <AdminFooter />:  <Footer />}
    </> 
  );
}
