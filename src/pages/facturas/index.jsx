import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetAllFacturasQuery } from "../../services/facturasApi";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";

const Facturas = () => {
  const theme = useTheme();
  const { data: facturas, isLoading } = useGetAllFacturasQuery({estado: "Cancelada"});
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  // Transformar las facturas para DataGrid
  const rows = facturas
    ? facturas.map((factura) => ({
        id: factura.id_factura,
        numero: factura.numero_factura,
        clienteNombre: factura.transaccion?.cliente?.nombre,
        observaciones: factura.observaciones,
        fecha: factura.fecha_emision,
        total: factura.total,
        estadoNombre: factura.estado?.nombre,
      }))
    : [];

  // Columnas del DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.25, resizable: false },
    { field: "numero", headerName: "Número", flex: 0.35, resizable: false },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 0.4,
      resizable: false,
    },
    { field: "observaciones", headerName: "Observaciones", flex: 0.5, resizable: false },
    {
      field: "fecha",
      headerName: "Fecha Emisión",
      flex: 0.6,
      renderCell: (params) => {
        return format(
          new Date(params.value),
          "dd 'de' MMMM 'de' yyyy, HH:mm",
          {
            locale: es,
          }
        );
      },
      resizable: false,
    },
    {
      field: "total",
      headerName: "Total ($)",
      flex: 0.35,
      renderCell: (params) =>
        `$${Number(params.value).toLocaleString("es-CL")}`,
      resizable: false,
    },
    {
      field: "estadoNombre",
      headerName: "Estado",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/facturas/editar/${params.row.id}`);
              //handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(params.row);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Función para manejar eliminación
  const handleDelete = (row) => {
    console.log("Eliminar factura:", row);
    // Lógica para eliminar factura
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: "1rem", // Añadimos un padding global para evitar desbordes
        overflow: "hidden", // Para evitar barras de desplazamiento innecesarias
      }}
    >
      {/* Encabezado */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="1rem"
        /* mb={2} */
        /* p="2rem" */
      >
        <Header title="Facturas" subtitle="Lista de Facturas" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log("Crear nueva factura")}
        >
          Nueva Factura
        </Button>
      </Box>

      {/* Tabla */}
      <Paper elevation={3} sx={{ padding: "1rem" }}>
        <Box
          height="70vh"
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
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
              fontWeight: 600,
              fontSize: "1.2rem",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.secondary[1000],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            /* "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            }, */
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={isLoading}
            checkboxSelection
            disableSelectionOnClick
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
              },
              "& .MuiDataGrid-cell": {
                color: theme.palette.text.primary,
                fontSize: "1rem",
              },
              fontWeight: 400,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Facturas;
