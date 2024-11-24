import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGetAuthenticatedUserQuery } from "../../services/authApi";

const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useGetAuthenticatedUserQuery();

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
