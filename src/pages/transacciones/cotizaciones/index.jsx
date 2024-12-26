import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/common/Header";
import DataGridCustomToolbar from "../../../components/common/DataGridCustomToolbar";
import {
  useGetAllTransaccionesQuery,
  useCreateTransaccionMutation,
  useDeleteTransaccionesMutation,
} from "../../../services/ventasApi";
import CustomNewButton from "../../../components/common/CustomNewButton";
import { useGetAllClientesQuery } from "../../../services/clientesApi";
import ModalForm from "../../../components/common/ModalForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useGetMetodosDePagoQuery } from "../../../services/pagosApi";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import AlertDialog from "../../../components/common/AlertDialog";
import { CustomPagination } from "../../../components/common/CustomPagination";

const Cotizaciones = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  //const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useGetAllTransaccionesQuery({
    tipo_transaccion: "cotizacion",
    search,
    page: page + 1,
    limit: pageSize
  });

  // Estados para eliminar
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTransacciones] = useDeleteTransaccionesMutation();

  useEffect(() => {
    // Detecta si hay un estado de refetch
    if (location.state?.refetch) {
      refetch(); // Forzar refetch
    }
  }, [location.state, refetch]);

  const { data: productosData, isLoading: isLoadingProductos } =
    useGetAllProductosQuery({ search: searchTerm });
  const [
    createCotizacion,
    { isLoading: isCreating, isError },
  ] = useCreateTransaccionMutation();
  const { data: clientes, isLoadingClientes } = useGetAllClientesQuery();
  const { data: metodosPago, isLoading: isLoadingMetodosPago } =
    useGetMetodosDePagoQuery();


  const isLoadingAll =
    isLoading ||
    isLoadingProductos ||
    isLoadingClientes ||
    isLoadingMetodosPago;

  const [selectedRows, setSelectedRows] = useState([]);
  // Modal agregar cotizaciones
  const [open, setOpen] = useState(false);
  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  // Mapear filas para la tabla
  const rows = data?.transacciones ? data?.transacciones.map((row) => ({
        ...row,

        clienteNombre: row.cliente?.nombre || "Sin cliente",
        usuarioNombre: row.usuario?.nombre || "Sin usuario",
        estadoNombre: row.estado?.nombre_estado || "Sin estado",
        id: row.id_transaccion,
      }))
    : [];

  const columns = [
    {
      field: "sequentialId",
      headerName: "ID",
      flex: 0.25,
      resizable: false,
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "usuarioNombre",
      headerName: "Usuario",
      flex: 0.3,
      resizable: false,
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 0.5,
      resizable: false,
    },
    {
      field: "fecha_creacion",
      headerName: "Fecha Creación",
      flex: 0.5,
      resizable: false,
      renderCell: (params) => {
        return format(new Date(params.value), "dd-MM-yyyy", {
          locale: es,
        });
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.35,
      resizable: false,
      renderCell: (params) =>
        `$${Number(params.row?.total || 0).toLocaleString()}`,
    },
    {
      field: "estadoNombre",
      headerName: "Estado",
      flex: 0.5,
      resizable: false,
    },
    {
      field: "editar",
      headerName: "Editar",
      flex: 0.3,
      resizable: false,
      sortable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          alignItems="center"
          gap={1}
        >
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>

        </Box>
      ),
    },
  ];

  const fields = [
    {
      name: "id_cliente",
      label: "Nombre del Cliente",
      type: "select",
      searchable: true, // Habilita react-select
      options: Array.isArray(clientes?.clientes)
        ? clientes?.clientes.map((cliente) => ({
            value: cliente.rut,
            label: cliente.nombre,
          }))
        : [],
      defaultValue: "",
      route: "/clientes/crear",
      searchOption: "Agregar Nuevo Cliente",
    },
    { name: "observaciones", label: "Observaciones", type: "text" },
    {
      name: "id_metodo_pago",
      label: "Método de Pago",
      type: "select",
      options: Array.isArray(metodosPago)
        ? metodosPago.map((metodo) => ({
            value: metodo.id_metodo_pago,
            label: metodo.nombre,
          }))
        : [],
      defaultValue: "",
    },
    {
      name: "detalles",
      label: "Detalles",
      type: "custom",
      productos: productosData ? productosData : [],
      setSearchTerm, // Pasa la función que actualiza el término de búsqueda
    },
  ];

  // Función para manejar formulario
  const handleSubmit = async (data) => {
    try {
      await createCotizacion({
        ...data,
        tipo_transaccion: "cotizacion",
        detalles: data.detalles,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Cotización creada exitosamente.",
          severity: "success",
        })
      );
      setOpen(false); // Cerrar el modal
      refetch(); // Actualizar la lista automáticamente
    } catch (error) {
      console.error("Error al crear cotización:", error);
      alert("Error al crear cotización: " + error.message);
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    navigate(`/cotizaciones/editar/${row.id_transaccion}`);
  };

  // Función para abrir la alerta de confirmación
  const handleOpenDelete = () => {
    if (selectedRows.length > 0) {
      setOpenAlert(true);
    } else {
      dispatch(
        showNotification({
          message: "Debe seleccionar al menos una transacción.",
          severity: "warning",
        })
      );
    }
  };

  // Función para eliminar transacciones
  const handleBulkDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteTransacciones({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Cotizaciones eliminadas correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]); // Limpiar selección
      refetch();
      // Refetch de datos
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar Cotizaciones: ${error.message}`,
          severity: "error",
        })
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Eliminar varias cotizaciones logicamente
   */

  const rowsPerPageOptions = [5, 10, 25, 50];
  
  if (isLoadingAll) {
    return <LoaderComponent />;
  }

  if (isError) {
    dispatch(
      showNotification({
        message: `Error al obtener cotizaciones: ${error.message}`,
        severity: "error",
      })
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Cotizaciones" subtitle="Lista de Cotizaciones" />
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
        }}
      >
        <CustomNewButton
          name={"Nueva Cotización"}
          onClick={() => setOpen(true)}
          disabled={isCreating}
        />
        <Button
          color="error"
          variant="contained"
          onClick={handleOpenDelete}
          disabled={selectedRows.length === 0 || deleteLoading}
        >
          Eliminar Seleccionados
        </Button>
        <DataGrid
          loading={isLoading || !data?.transacciones}
          getRowId={(row) => row.sequentialId}
          rows={rows}
          columns={columns}
          /* rowCount={paginacion?.totalItems || 0} */
          paginationMode="server" 
          rowCount={paginacion?.totalItems || rows.length}
          paginationModel={{
            pageSize: pageSize,
            page: page,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          pageSizeOptions={rowsPerPageOptions}
          sx={{
            color: "black",
            fontWeight: 400,
            fontSize: "1rem",
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
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title={"Crear Cotización"}
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar las ${selectedRows.length} transacciones seleccionadas?`}
      />
    </Box>
  );
};

export default Cotizaciones;
