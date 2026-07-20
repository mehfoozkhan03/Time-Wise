import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Home from './../pages/Home';
import Dashboard from './../pages/Dashboard';
import Community from './../pages/Community';
import About from './../pages/About';
import Contact from './../pages/Contact';
import SignUpPage from './../pages/Login';
import ProgressBar from './../components/ProgressBar/progressBar';
import BubbleCursor from './../components/BubbleArrow/bubbleArrow';
import RouteLoader from './../components/RouteLoader';

import { Settings } from './../pages/Settings';
import { Profile } from './../components/Setting/Profile';
import Calendar from './../components/Setting/Calendar';
import { SettingAttendance } from './../components/Setting/SettingAttendance';
import { Appearance } from './../components/Setting/Appearance';
import { Notification } from './../components/Setting/Notifications';
import { Security } from './../components/Setting/Security';
import { DataExport } from './../components/Setting/DataExport';
import { HelpSupport } from './../components/Setting/HelpSupport';
import EmployeeTable from '../pages/EmployeeTable';
import EmployeeDetails from '../pages/EmployeeDetails';
import { Error } from '../components/Error/Error';

import { PrivateRoutes } from '../components/PrivateRoutes';
import { DashboardHome } from '../components/Dashboard/DashboardHome';
import { DashboardEmployee } from './../components/Dashboard/DashboardEmployee';
import { DashboardAttendance } from './../components/Dashboard/DashboardAttendance';
import { DashboardThuoght } from './../components/Dashboard/DashboardThought';
import { DashboardNotification } from './../components/Dashboard/DashboardNotification';
import { DashboardAnnouncement } from './../components/Dashboard/DashboardAnnouncement';
import { DashboardReport } from './../components/Dashboard/DashboardReport';
import { DashboardSetting } from './../components/Dashboard/DashboardSetting';
import Attendance from '../pages/Attendance/Attendance';

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
          <Route
            path="/attendance"
            element={
              <PrivateRoutes>
                <Attendance />
              </PrivateRoutes>
            }
          />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />}></Route>
            <Route path="home" element={<DashboardHome />}></Route>
            <Route path="employee" element={<DashboardEmployee />}></Route>
            <Route path="attendance" element={<DashboardAttendance />}></Route>
            <Route path="thought" element={<DashboardThuoght />}></Route>
            <Route
              path="notification"
              element={<DashboardNotification />}
            ></Route>
            <Route
              path="announcement"
              element={<DashboardAnnouncement />}
            ></Route>
            <Route path="report" element={<DashboardReport />}></Route>
            <Route path="setting" element={<DashboardSetting />}></Route>
          </Route>
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
            <Route path="attendance" element={<SettingAttendance />}></Route>
            <Route path="calendar" element={<Calendar />} />
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
