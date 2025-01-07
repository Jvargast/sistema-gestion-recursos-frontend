import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleBasedRoute = ({ requiredPermission, children }) => {
  const { permisos } = useSelector((state) => state.auth);

  const hasPermission = permisos.includes(requiredPermission);

  if (!hasPermission) {
    // Redirige a una página no autorizada si no tiene permiso
    return <Navigate to="/unauthorized" replace />;
  }

  // Renderiza el contenido si tiene el permiso
  return children || <Outlet />;
};

export default RoleBasedRoute;
