import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppRoutes } from './routes/AppRoutes';
import { fetchCurrentUser } from './store/authSlice';
import { ScrollTop } from './components/ScrollTop/ScrollTop';
import { Chatbot } from './components/ChatBot/chatBot';
import { AdminChatBot } from './components/AdminChatBot/AdminChatBot';
import { socket } from './socket/socket';
import { addNotification } from './store/notificationSlice';
import { ScrollToTopButton } from './components/ScrollToTop/scrollToTop';
import { FloatingControlsProvider } from './context/FloatingControlsContext';
import { getNotificationPreferences } from './services/notificationPreferenceService';
import {
  cacheNotificationPreferences,
  getCachedNotificationPreferences,
  isNotificationQuietNow,
} from './utils/notificationPreferences';

function AppContent() {
  const [notificationPreferencesReady, setNotificationPreferencesReady] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated: isEmployeeAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: isAdminAuthenticated } = useSelector((state) => state.adminAuth);
  const location = useLocation();
  const isLoginPage = ["/login", "/signup", "/admin/login"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/adminDashboard");
  const showEmployeeBot = Boolean(user && isEmployeeAuthenticated && !isAdminPage && !isLoginPage);
  const showAdminBot = Boolean(isAdminAuthenticated && isAdminPage && !isLoginPage);

  useEffect(() => {
  if (isAdminAuthenticated) return;

  dispatch(fetchCurrentUser());
}, [dispatch, isAdminAuthenticated]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('register', user._id);

    return () => {
      socket.off();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id || !isEmployeeAuthenticated) {
      setNotificationPreferencesReady(false);
      return;
    }
    let active = true;
    getNotificationPreferences()
      .then(({ data }) => {
        if (!active) return;
        cacheNotificationPreferences(user._id, data.preferences);
        setNotificationPreferencesReady(true);
      })
      .catch((error) => {
        console.error("Unable to sync notification preferences:", error);
        if (active) setNotificationPreferencesReady(true);
      });
    return () => {
      active = false;
    };
  }, [isEmployeeAuthenticated, user?._id]);

  useEffect(() => {
    socket.on('new-notification', (notification) => {
      if (!notificationPreferencesReady) return;
      const preferences = getCachedNotificationPreferences(user?._id);
      if (preferences.inAppAlerts) dispatch(addNotification(notification));

      const quiet = notification.critical ? false : (preferences.quietMode || isNotificationQuietNow(preferences));
      if (!quiet && preferences.pushNotifications && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(notification.title || "TimeWise", {
            body: notification.message || "You have a new notification.",
            icon: "/Logo_N.svg",
          });
        } catch (error) {
          console.warn("Desktop notification could not be shown:", error);
        }
      }

      if (!quiet && preferences.pushNotifications && preferences.soundAlerts) {
        try {
          const audioContext = new window.AudioContext();
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator.frequency.value = 660;
          gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
          oscillator.connect(gain);
          gain.connect(audioContext.destination);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          oscillator.onended = () => audioContext.close();
        } catch {
          // Browsers can block sound until the user has interacted with the page.
        }
      }
    });

    return () => {
      socket.off('new-notification');
    };
  }, [dispatch, notificationPreferencesReady, user?._id]);
  {isAdminAuthenticated && <AdminChatBot />}

  return (
    <FloatingControlsProvider>
      <ScrollTop />
      <ScrollToTopButton />
      <AppRoutes />

      {showEmployeeBot && <Chatbot />}
      {showAdminBot && <AdminChatBot />}
    </FloatingControlsProvider>
  );
}

export default function App() {
  return <AppContent />;
}
