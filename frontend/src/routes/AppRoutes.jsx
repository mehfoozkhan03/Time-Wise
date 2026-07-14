import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "./../pages/Home";
import Dashboard from "./../pages/Dashboard";
import Community from "./../pages/Community";
import About from "./../pages/About";
import Contact from "./../pages/Contact";
import SignUpPage from "./../pages/Login";
import ProgressBar from "./../components/ProgressBar/progressBar";
import BubbleCursor from "./../components/BubbleArrow/bubbleArrow";
import RouteLoader from "./../components/RouteLoader";

import { Settings } from "./../pages/Settings";
import { Profile } from "./../components/Setting/Profile";
import { Attendance } from "./../components/Setting/Attendance";
import { Appearance } from "./../components/Setting/Appearance";
import { Notification } from "./../components/Setting/Notifications";
import { Security } from "./../components/Setting/Security";
import { DataExport } from "./../components/Setting/DataExport";
import { HelpSupport } from "./../components/Setting/HelpSupport";
import EmployeeTable from "../pages/EmployeeTable";
import EmployeeDetails from "../pages/EmployeeDetails";
import { Error } from "../components/Error/Error";

import { PrivateRoutes } from "../components/PrivateRoutes";

export const AppRoutes = () => {
  return (
    <>
      <RouteLoader />
      <BubbleCursor />
      <ProgressBar />
      <Routes>
        {/* Main Website */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PrivateRoutes>
                <Home />
              </PrivateRoutes>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Employee */}
          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/employee-details" element={<EmployeeDetails />} />
          <Route path="/settings" element={<Settings />}>
            <Route index element={<Profile />}></Route>
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<Attendance />}></Route>
            <Route path="appearance" element={<Appearance />}></Route>
            <Route path="notification" element={<Notification />}></Route>
            <Route path="security" element={<Security />}></Route>
            <Route path="data_export" element={<DataExport />}></Route>
            <Route path="help_support" element={<HelpSupport />}></Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </>
  );
};
