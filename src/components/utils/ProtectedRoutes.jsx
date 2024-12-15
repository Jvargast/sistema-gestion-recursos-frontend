import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoaderComponent from "../common/LoaderComponent";
import { useSelector } from "react-redux";
const ProtectedRoute = () => {
  const location = useLocation();
  const {isAuthenticated} = useSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
