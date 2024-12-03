import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGetAuthenticatedUserQuery } from "../../services/authApi";
import LoaderComponent from "../common/LoaderComponent";
const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useGetAuthenticatedUserQuery();

  if (isLoading) return <div> <LoaderComponent/> </div>;
  if (isError || !user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
