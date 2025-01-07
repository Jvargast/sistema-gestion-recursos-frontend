import React from "react";
import { useSelector } from "react-redux";

const PermissionGuard = ({ permission, children }) => {
  const { permisos } = useSelector((state) => state.auth);

  // Verifica si el usuario tiene el permiso requerido
  if (!permisos.includes(permission)) {
    return null; // No muestra nada si no tiene permiso
  }

  return <>{children}</>; // Muestra el contenido si tiene permiso
};

export default PermissionGuard;
