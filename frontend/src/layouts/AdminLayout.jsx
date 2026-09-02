import { Outlet } from "react-router-dom";
import AdminFooter from "../components/AdminFooter/AdminFooter";


export const AdminLayout = () => {
    return (
    <main className="admin_layout">
      <Outlet />
      <AdminFooter />
    </main>
  );
}