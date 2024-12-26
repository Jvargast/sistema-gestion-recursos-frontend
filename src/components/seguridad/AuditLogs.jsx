import React from "react";
import PaginatedTable from "./PaginatedTable";

const AuditLogs = ({ logs, isLoading, onPageChange, paginacion }) => {
  const columns = [
    { field: "userId", headerName: "Usuario" },
    { field: "action", headerName: "Acción" },
    { field: "module", headerName: "Módulo" },
    { field: "ip_address", headerName: "IP" },
    { field: "createdAt", headerName: "Fecha" },
  ];

  return (
    <PaginatedTable
      title="Logs de Auditoría"
      data={logs}
      isLoading={isLoading}
      onPageChange={onPageChange}
      paginacion={paginacion}
      columns={columns}
    />
  );
};

export default AuditLogs;

