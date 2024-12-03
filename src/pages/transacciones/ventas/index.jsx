import React, { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/common/Header";
import DataGridCustomToolbar from "../../../components/common/DataGridCustomToolbar";
import { useGetAllTransaccionesQuery } from "../../../services/ventasApi";
import CustomNewButton from "../../../components/common/CustomNewButton";
/* import { EditAttributesOutlined } from "@mui/icons-material"; */

const Ventas = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useGetAllTransaccionesQuery({
    tipo_transaccion: "venta",
    search
  });

  // Mapear filas para la tabla
  const rows = data
    ? data.map((row) => ({
        ...row,

        clienteNombre: row.cliente?.nombre || "Sin cliente",
        usuarioNombre: row.usuario?.nombre || "Sin usuario",
        estadoNombre: row.estado?.nombre_estado || "Sin estado",
        id: row.id_transaccion,
      }))
    : [];

  /*   const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  }); */

  const columns = [
    {
      field: "id_transaccion",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 0.5,
    },
    {
      field: "usuarioNombre",
      headerName: "Usuario",
      flex: 0.5,
    },
    {
      field: "tipo_transaccion",
      headerName: "Tipo Transacción",
      flex: 0.5,
      sortable: false,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.5,
      renderCell: (params) =>
        `$${Number(params.row?.total || 0).toLocaleString()}`,
    },
    {
      field: "estadoNombre",
      headerName: "Estado",
      flex: 0.5,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          alignItems="center"
          gap={1}
        >
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    console.log("Editar cotización:", row);
    // Aquí puedes implementar lógica adicional, como abrir un modal para editar la cotización
  };

  // Función para manejar la acción de eliminar
  const handleDelete = (row) => {
    console.log("Eliminar cotización:", row);
    // Aquí puedes implementar la lógica para eliminar la cotización
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Ventas" subtitle="Lista de Ventas" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[50],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.secondary[1000],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.grey[300],
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <CustomNewButton name={"Nueva Venta"}/ >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.id_transaccion}
          rows={rows}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="client"
          sx={{color:"black", fontWeight: 400}}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          slots={{
            toolbar: DataGridCustomToolbar,
          }}
          slotProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Ventas;
