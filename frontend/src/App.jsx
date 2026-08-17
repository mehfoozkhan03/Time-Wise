import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "./routes/AppRoutes";
import { fetchCurrentUser } from "./store/authSlice";
import { ScrollTop } from "./components/ScrollTop/ScrollTop";
import { socket } from "./socket/socket";
import { addNotification } from "./store/notificationSlice";

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
      <AppRoutes />
    </BrowserRouter>
  );
}
