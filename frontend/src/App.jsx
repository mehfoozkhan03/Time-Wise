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

import { Settings } from "./pages/Settings";
import { Profile } from "./components/Setting/Profile";
import { Appearance } from "./components/Setting/Appearance";
import { Attendance } from "./components/Setting/Attendance";
import { Notification } from "./components/Setting/Notifications";
import { DataExport } from "./components/Setting/DataExport";
import { Security } from "./components/Setting/Security";
import { HelpSupport } from './components/Setting/HelpSupport';


export default function App() {
  return (
    <BrowserRouter>
      <BubbleCursor />
      <ProgressBar />
      <Routes>
        {/* Main Website */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/settings" element={<Settings />} >
            <Route index element={<Profile />}></Route>
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<Attendance />}></Route>
            <Route path="appearance" element={<Appearance />}></Route>
            <Route path="notification" element={<Notification />}></Route>
            <Route path="security" element={<Security />}></Route>
            <Route path="data_export" element={<DataExport />}></Route>
            <Route path="help_support" element={<HelpSupport />}></Route>
          </Route> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
