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
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

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
    search: search,
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
        tipoFactura: factura.tipo_factura,
        preciosOpcion: factura.precios_opcion,
        formaPago: factura.forma_pago,
        clienteNombre: factura.documento?.cliente?.nombre,
        clienteEmail: factura.documento?.cliente?.email,
        clienteRut: factura.documento?.cliente?.rut,
        tipoDocumento: factura.documento?.tipo_documento,
        total: factura.documento?.total,
        fechaEmision: factura.documento?.fecha_emision,
        estadoPago: factura.documento?.estadoPago?.nombre,
        estadoPagoDescripcion: factura.documento?.estadoPago?.descripcion,
        sequentialId: factura.sequentialId,
      }))
    : [];

  // Columnas del DataGrid
  const columns = [
    { field: "sequentialId", headerName: "ID", flex: 0.25, resizable: false },
    { field: "numero", headerName: "Número", flex: 0.35, resizable: false },
    {
      field: "formaPago",
      headerName: "Forma Pago",
      flex: 0.3,
      resizable: false,
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "fechaEmision",
      headerName: "Fecha Emisión",
      flex: 0.5,
      renderCell: (params) => {
        return format(new Date(params.value), "dd-MM-yyyy, HH:mm", {
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
      field: "estadoPago",
      headerName: "Estado",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.3,
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
          message: "Ventas eliminadas correctamente.",
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
        /* backgroundColor: theme.palette.grey[100], */
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
      <Paper elevation={3} sx={{ padding: "0.7rem" }}>
        <Box
          height="70vh"
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              display: "none", // Oculta la barra en navegadores basados en Webkit
            },
            "msOverflowStyle": "none", // Oculta la barra en IE y Edge heredado
            "scrollbarWidth": "none",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary[400], // Ajusta el color de fondo del encabezado
              color: theme.palette.background.alt, // Ajusta el color del texto
              fontWeight: "bold", // Asegúrate de que el texto sea destacado
              borderBottom: "1px solid", // Añade un borde si es necesario
              fontSize: "1.2rem",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
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
            slotProps={{
              toolbar: { searchInput, setSearchInput, setSearch },
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
