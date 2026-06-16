import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken");

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;