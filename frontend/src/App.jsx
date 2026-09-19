import { BrowserRouter, useLocation } from 'react-router-dom';
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
    dispatch(fetchCurrentUser());
  }, [dispatch]);

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

  return (
    <>
      <ScrollTop />
      <ScrollToTopButton />
      <AppRoutes />

      {showEmployeeBot && <Chatbot />}
      {showAdminBot && <AdminChatBot />}
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
