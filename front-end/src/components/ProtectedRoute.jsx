import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}