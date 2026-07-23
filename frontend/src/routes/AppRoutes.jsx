import { Route, Routes } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Home from './../pages/Home'
import AdminDashboard from './../pages/AdminDashboard'
import Community from './../pages/Community'
import About from './../pages/About'
import Contact from './../pages/Contact'
import SignUpPage from './../pages/Login'

import ProgressBar from './../components/ProgressBar/progressBar'
import BubbleCursor from './../components/BubbleArrow/bubbleArrow'
import RouteLoader from './../components/RouteLoader'

import Calendar from './../components/Setting/Calendar'

import EmployeeTable from '../pages/EmployeeTable'
import EmployeeDetails from '../pages/EmployeeDetails'
import EmployeeProfile from './../pages/EmployeeProfile/EmployeeProfile'

import { Error } from '../components/Error/Error'
import { PrivateRoutes } from '../components/PrivateRoutes'

import Attendance from '../pages/Attendance/Attendance'
import { Reports } from './../pages/Reports/Reports'

import { Settings } from '../pages/Settings'
import { Profile } from './../components/Setting/Profile/Profile'
import { SettingAttendance } from './../components/Setting/SettingAttendance/SettingAttendance'
import { Appearance } from './../components/Setting/Appearance/Appearance'
import { Notification } from './../components/Setting/Notification/Notifications'
import { Security } from './../components/Setting/Security/Security'
import { DataExport } from './../components/Setting/DataExport/DataExport'
import { HelpSupport } from './../components/Setting/HelpSupport/HelpSupport'

import { DashboardEmployee } from './../components/Dashboard/DashboardEmployee/DashboardEmployee'
import { DashboardHome } from './../components/Dashboard/DashboardHome/DashboardHome'
import { DashboardAttendance } from './../components/Dashboard/DashboardAttendance/DashboardAttendance'
import { DashboardThuoght } from './../components/Dashboard/DashboardThought/DashboardThought'
import { DashboardNotification } from './../components/Dashboard/DashboardNotification/DashboardNotification'
import { DashboardAnnouncement } from './../components/Dashboard/DashboardAnnouncement/DashboardAnnouncement'
import { DashboardReport } from './../components/Dashboard/DashboardReport/DashboardReport'
import { DashboardSetting } from './../components/Dashboard/DashboardSetting/DashboardSetting'

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

          {/* ================= ADMIN DASHBOARD ================= */}

          <Route path="/dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="/dashboard/" element={<DashboardHome />} />
            <Route path="employee" element={<DashboardEmployee />} />
            <Route path="attendance" element={<DashboardAttendance />} />
            <Route path="thought" element={<DashboardThuoght />} />
            <Route path="notification" element={<DashboardNotification />} />
            <Route path="announcement" element={<DashboardAnnouncement />} />
            <Route path="report" element={<DashboardReport />} />
            <Route path="setting" element={<DashboardSetting />} />
          </Route>

          {/* ================= PUBLIC PAGES ================= */}

          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin/login" element={<SignUpPage />} />

          {/* ================= EMPLOYEES ================= */}

          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/employee-details" element={<EmployeeDetails />} />

          {/* ================= SETTINGS ================= */}

          <Route path="/settings" element={<Settings />}>
            <Route index element={<Profile />} />
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
      </Routes>
    </>
  )
}
