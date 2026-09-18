import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminPrivateRoutes = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth);

  if (
    !isAuthenticated ||
    isAuthenticated === undefined ||
    isAuthenticated === null
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
};
