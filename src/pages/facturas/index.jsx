import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Box, Button, IconButton, useTheme, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  useDeleteFacturasMutation,
  useGetAllFacturasQuery,
} from "../../services/facturasApi";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolbar";
import { CustomPagination } from "../../components/common/CustomPagination";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import AlertDialog from "../../components/common/AlertDialog";

const Facturas = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openAlert, setOpenAlert] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [deleteFacturas, { isLoading: isDeleting }] =
    useDeleteFacturasMutation();

  const {
    data: facturas,
    isLoading,
    refetch,
  } = useGetAllFacturasQuery({
    estado: "Cancelada",
    page: page + 1,
    limit: pageSize,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const paginacion = useMemo(
    () => facturas?.paginacion || {},
    [facturas?.paginacion]
  );

  // Transformar las facturas para DataGrid
  const rows = facturas?.facturas
    ? facturas?.facturas?.map((factura) => ({
        id: factura.id_factura,
        numero: factura.numero_factura,
        clienteNombre: factura.transaccion?.cliente?.nombre,
        observaciones: factura.observaciones,
        fecha: factura.fecha_emision,
        total: factura.total,
        estadoNombre: factura.estado?.nombre,
        sequentialId: factura.sequentialId,
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
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 0.5,
      resizable: false,
    },
    {
      field: "fecha",
      headerName: "Fecha Emisión",
      flex: 0.6,
      renderCell: (params) => {
        return format(new Date(params.value), "dd 'de' MMMM 'de' yyyy, HH:mm", {
          locale: es,
        });
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
        </Box>
      ),
    },
  ];

  // Función para eliminar transacciones
  const handleBulkDelete = async () => {
    try {
      await deleteFacturas({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Ventas eliminadss correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar Pedidos: ${error.error}`,
          severity: "error",
        })
      );
    }
  };

  const rowsPerPageOptions = [5, 10, 25, 50];

  const handlePageChange = (paginationModel) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const handleOpenDelete = () => {
    if (selectedRows.length > 0) {
      setOpenAlert(true);
    } else {
      dispatch(
        showNotification({
          message: "Debe seleccionar al menos una factura.",
          severity: "warning",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

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
          <Button
            color="error"
            variant="contained"
            onClick={handleOpenDelete}
            disabled={selectedRows.length === 0 || isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
          </Button>
          <DataGrid
            rows={rows}
            getRowId={(row) => row.sequentialId}
            rowCount={paginacion?.totalItems || rows.length}
            columns={columns}
            paginationMode="server"
            paginationModel={{
              pageSize: pageSize,
              page: page,
            }}
            onPaginationModelChange={handlePageChange}
            pageSizeOptions={rowsPerPageOptions}
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
            slots={{
              toolbar: DataGridCustomToolbar,
              pagination: CustomPagination,
            }}
          />
        </Box>
      </Paper>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar las ${selectedRows.length} facturas seleccionadas?`}
      />
    </Box>
  );
};

export default Facturas;
