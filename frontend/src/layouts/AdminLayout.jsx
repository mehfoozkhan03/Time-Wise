import { Outlet } from "react-router-dom";


export const AdminLayout = () => {
    return (
    <main className="admin_layout">
      <Outlet />
    </main>
  );
}