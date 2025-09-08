import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../store/userContext.js";

export default function PrivateRoutes() {
  const { isAuthenticated, loading } = useUser();
  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
