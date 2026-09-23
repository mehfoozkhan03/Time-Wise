import { Outlet } from "react-router-dom";
import { ActivityTracker } from "../hooks/ActivityTracker";


export const AuthLayout = () => {
  return (
    <main className="auth_layout">
      <Outlet />
    </main>
  );
};
