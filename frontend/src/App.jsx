import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "./routes/AppRoutes";
import { fetchCurrentUser } from "./store/authSlice";
import { ScrollTop } from "./components/ScrollTop/ScrollTop";
import { Chatbot } from "./components/ChatBot/chatBot";
import { socket } from "./socket/socket";
import { addNotification } from "./store/notificationSlice";
import { ScrollToTopButton } from "./components/ScrollToTop/scrollToTop";

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", user._id);

    return () => {
      // Sirf logout ya app unmount par disconnect karenge
      socket.off();
    };
  }, [user?._id]);

  useEffect(() => {
    socket.on("new-notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off("new-notification");
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollTop />
      <ScrollToTopButton />
      <AppRoutes />
      <Chatbot />
    </BrowserRouter>
  );
}
