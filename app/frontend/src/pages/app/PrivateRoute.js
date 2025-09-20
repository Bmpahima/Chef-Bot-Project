import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../store/userContext.js";
import { RecipeDraftProvider } from "../../store/recipeDraftContext.js";

export default function PrivateRoutes() {
  const { isAuthenticated, loading } = useUser();
  if (loading) return null;
  return isAuthenticated ? (
    <RecipeDraftProvider>
      <Outlet />
    </RecipeDraftProvider>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}
