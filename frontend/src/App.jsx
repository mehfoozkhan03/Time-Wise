import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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

function AppContent() {
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
    socket.on('new-notification', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off('new-notification');
    };
  }, [dispatch]);
  // {isAdminAuthenticated && <AdminChatBot />}

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
