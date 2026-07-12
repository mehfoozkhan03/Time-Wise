import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUpPage from "./pages/Login";
import BubbleCursor from "./components/BubbleArrow/bubbleArrow";
import ProgressBar from "./components/ProgressBar/progressBar";
import RouteLoader from "./components/RouteLoader";

import { Settings } from "./pages/Settings";
import { Profile } from "./components/Setting/Profile";
import { Appearance } from "./components/Setting/Appearance";
import { Attendance } from "./components/Setting/Attendance";
import { Notification } from "./components/Setting/Notifications";
import { DataExport } from "./components/Setting/DataExport";
import { Security } from "./components/Setting/Security";
import { HelpSupport } from './components/Setting/HelpSupport';


import EmployeeTable from "./pages/EmployeeTable";
import EmployeeDetails from "./pages/EmployeeDetails";

export default function App() {
  return (
    <BrowserRouter>
  <RouteLoader />
  <BubbleCursor />
  <ProgressBar />

  <Routes>
    <Route element={<MainLayout />}>

      {/* Main Website */}
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Employee */}
      <Route path="/employees" element={<EmployeeTable />} />
      <Route path="/employee-details" element={<EmployeeDetails />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="appearance" element={<Appearance />} />
        <Route path="notification" element={<Notification />} />
        <Route path="security" element={<Security />} />
        <Route path="data_export" element={<DataExport />} />
        <Route path="help_support" element={<HelpSupport />} />
      </Route>

    </Route>
  </Routes>
</BrowserRouter>
  );
}
