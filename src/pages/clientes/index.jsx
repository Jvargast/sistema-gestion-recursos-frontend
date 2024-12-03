import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import Header from "../../components/common/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllClientesQuery } from "../../services/clientesApi";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomNewButton from "../../components/common/CustomNewButton";

const Clientes = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetAllClientesQuery();

  const rows = data
    ? data.map((row) => ({
        ...row,
        id: row.rut,
      }))
    : [];

  const columns = [
    {
      field: "rut",
      headerName: "Rut",
      flex: 0.3,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.6,
    },
    {
      field: "telefono",
      headerName: "Telefóno",
      flex: 0.5,
      /* renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      }, */
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 0.5,
    },
    {
      field: "tipo_cliente",
      headerName: "Empresa/Persona",
      flex: 0.4,
    },
    {
      field: "activo",
      headerName: "Activo",
      flex: 0.3,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Punto de color */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: params.value ? "green" : "red",
            }}
          ></div>
          {/* Texto */}
          <span>{params.value ? "Activo" : "Inactivo"}</span>
        </div>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.4,
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
            <EditRoundedIcon />
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
      <Header title="Clientes" subtitle="Lista de Clientes" />
      <Box
        mt="40px"
        height="75vh"
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
        <CustomNewButton name={"Nuevo Cliente"} />
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.rut}
          rows={rows || []}
          columns={columns}
          sx={{ color: "black", fontWeight: 400 }}
        />
      </Box>
    </Box>
  );
};

export default Clientes;
