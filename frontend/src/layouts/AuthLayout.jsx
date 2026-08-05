import { Outlet } from "react-router-dom";


export const AuthLayout = () => {
  return (
    <main className="auth_layout">
      <Outlet />
    </main>
  );
};
