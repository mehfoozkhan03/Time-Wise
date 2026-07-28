import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppRoutes } from "./routes/AppRoutes";
import { fetchCurrentUser } from "./store/authSlice";
import { ScrollTop } from "./components/ScrollTop/ScrollTop";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
