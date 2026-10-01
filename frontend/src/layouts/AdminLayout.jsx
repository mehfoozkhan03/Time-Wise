import { Outlet } from "react-router-dom";
import AdminFooter from "../components/AdminFooter/AdminFooter";
import { AdminThemeApplier } from "../ThemeApplier/AdminThemeApplier";


export const AdminLayout = () => {
    return (
    <main className="admin_layout">
      <AdminThemeApplier />
      <Outlet />
      <AdminFooter />
    </main>
  );
}