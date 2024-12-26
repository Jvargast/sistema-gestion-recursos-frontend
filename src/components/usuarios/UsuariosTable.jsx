import React from "react";
import PaginatedTable from "../seguridad/PaginatedTable";


const UsuariosTable = ({
  transactions,
  isLoading,
  onPageChange,
  paginacion,
}) => {
  const columns = [
    { field: "id_log", headerName: "Id Log", width: "5%", minWidth: "50px" },
    { field: "id_usuario", headerName: "Usuario", width: "10%", minWidth: "80px" },
    { field: "accion", headerName: "Acción", width: "10%", minWidth: "100px" },
    { field: "estado", headerName: "Estado", width: "10%", minWidth: "80px" },
    {
      field: "fecha_creacion",
      headerName: "Fecha",
      width: "10%",
      minWidth: "150px",
      renderCell: ({ value }) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <PaginatedTable
      title="Usuarios"
      data={transactions}
      isLoading={isLoading}
      onPageChange={onPageChange}
      paginacion={paginacion}
      columns={columns}
    />
  );
};

export default UsuariosTable;