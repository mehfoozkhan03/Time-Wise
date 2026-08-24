import { Route, Routes, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from './../pages/Home';
import AdminDashboard from './../pages/AdminDashboard';
import Community from './../pages/Community/Community';
import About from './../pages/About';
import Contact from './../pages/Contact';
import SignUpPage from './../pages/Login';

import ProgressBar from './../components/ProgressBar/progressBar';
import { BubbleCursor } from './../components/BubbleArrow/bubbleArrow';
import RouteLoader from './../components/RouteLoader';

import Calendar from './../components/Setting/Calendar';

import EmployeeTable from '../pages/EmployeeTable';
import EmployeeDetails from '../pages/EmployeeDetails';
import EmployeeProfile from './../pages/EmployeeProfile/EmployeeProfile';

import { Error } from '../components/Error/Error';
import { PrivateRoutes } from '../components/PrivateRoutes';

import Attendance from '../pages/Attendance/Attendance';
import { Reports } from './../pages/Reports/Reports';

import { Settings } from '../pages/Settings';
import { Profile } from './../components/Setting/Profile/Profile';
import { SettingAttendance } from './../components/Setting/SettingAttendance/SettingAttendance';
import { Appearance } from './../components/Setting/Appearance/Appearance';
import { Notification } from './../components/Setting/Notification/Notifications';
import { Security } from './../components/Setting/Security/Security';
import { DataExport } from './../components/Setting/DataExport/DataExport';
import { HelpSupport } from './../components/Setting/HelpSupport/HelpSupport';

import { DashboardEmployee } from './../components/Dashboard/DashboardEmployee/DashboardEmployee';
import { DashboardHome } from './../components/Dashboard/DashboardHome/DashboardHome';
import { DashboardAttendance } from './../components/Dashboard/DashboardAttendance/DashboardAttendance';
import { DashboardThuoght } from './../components/Dashboard/DashboardThought/DashboardThought';
import { DashboardNotification } from './../components/Dashboard/DashboardNotification/DashboardNotification';
import { DashboardAnnouncement } from './../components/Dashboard/DashboardAnnouncement/DashboardAnnouncement';
import { DashboardReport } from './../components/Dashboard/DashboardReport/DashboardReport';
import { DashboardSetting } from './../components/Dashboard/DashboardSetting/DashboardSetting';

import { SinglePost } from '../pages/SinglePost/SinglePost';
import { NotificationPage } from '../pages/NotificationPage/NotificationPage';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { CommunityProfile } from '../components/community/CommunityProfile/CommunityProfile';
import { DashboardLeave } from '../components/Dashboard/DashboardLeave/DashboardLeave';

export const AppRoutes = () => {
  return (
    <>
      <RouteLoader />
      <BubbleCursor />
      <ProgressBar />

      <Routes>
        <Route element={<MainLayout />}>
          {/* ================= HOME ================= */}

          <Route
            path="/"
            element={
              <PrivateRoutes>
                <Home />
              </PrivateRoutes>
            }
          />

          {/* ================= ATTENDANCE ================= */}

          <Route
            path="/attendance"
            element={
              <PrivateRoutes>
                <Attendance />
              </PrivateRoutes>
            }
          />

          {/* ================= EMPLOYEE PROFILE ================= */}

          <Route
            path="/employee"
            element={
              <PrivateRoutes>
                <EmployeeProfile />
              </PrivateRoutes>
            }
          />

          {/* ================= REPORTS ================= */}

          <Route
            path="/reports"
            element={
              <PrivateRoutes>
                <Reports />
              </PrivateRoutes>
            }
          />

          {/* ================= PUBLIC PAGES ================= */}

          <Route
            path="/community/:filter?"
            element={
              <PrivateRoutes>
                <Community />
              </PrivateRoutes>
            }
          />
          <Route
            path="/community/post/:id"
            element={
              <PrivateRoutes>
                <SinglePost />
              </PrivateRoutes>
            }
          />

          <Route
            path="/community/profile/:userId"
            element={
              <PrivateRoutes>
                <CommunityProfile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/community/post/:postId"
            element={
              <PrivateRoutes>
                <SinglePost />
              </PrivateRoutes>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/notifications"
            element={
              <PrivateRoutes>
                <NotificationPage />
              </PrivateRoutes>
            }
          />

          {/* ================= EMPLOYEES ================= */}

          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/employee-details" element={<EmployeeDetails />} />

          {/* ================= SETTINGS ================= */}

          <Route path="/settings" element={<Settings />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<SettingAttendance />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="appearance" element={<Appearance />} />
            <Route path="notification" element={<Notification />} />
            <Route path="security" element={<Security />} />
            <Route path="data_export" element={<DataExport />} />
            <Route path="help_support" element={<HelpSupport />} />
          </Route>

          {/* ================= 404 ================= */}

          <Route path="*" element={<Error />} />
        </Route>

        {/* ================= Auth Layout ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* ================= Admin Layout ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<SignUpPage />} />

          {/* ================= ADMIN DASHBOARD ================= */}
          <Route path="/adminDashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="adminDashboard" element={<DashboardHome />} />
            <Route path="employee" element={<DashboardEmployee />} />
            <Route path="attendance" element={<DashboardAttendance />} />
            <Route path="leave" element={<DashboardLeave />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="thought" element={<DashboardThuoght />} />
            <Route path="notification" element={<DashboardNotification />} />
            <Route path="announcement" element={<DashboardAnnouncement />} />
            <Route path="report" element={<DashboardReport />} />
            <Route path="setting" element={<DashboardSetting />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};
