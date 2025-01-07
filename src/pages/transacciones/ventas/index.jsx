import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/common/Header";
import DataGridCustomToolbar from "../../../components/common/DataGridCustomToolbar";
import {
  useCreateTransaccionMutation,
  useDeleteTransaccionesMutation,
  useGetAllTransaccionesQuery,
} from "../../../services/ventasApi";
import CustomNewButton from "../../../components/common/CustomNewButton";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useGetAllClientesQuery } from "../../../services/clientesApi";
//import { useGetMetodosDePagoQuery } from "../../../services/pagosApi";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import LoaderComponent from "../../../components/common/LoaderComponent";
import ModalForm from "../../../components/common/ModalForm";
import AlertDialog from "../../../components/common/AlertDialog";
import { CustomPagination } from "../../../components/common/CustomPagination";

const Ventas = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  //const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useGetAllTransaccionesQuery({
      tipo_transaccion: "venta",
      search,
      page: page + 1,
      limit: pageSize,
    });

  const [createVenta, { isLoading: isCreating }] =
    useCreateTransaccionMutation();


  // Estados para eliminar
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTransacciones, { isLoading: isDeleting }] =
    useDeleteTransaccionesMutation();

  useEffect(() => {
    // Detecta si hay un estado de refetch
    if (location.state?.refetch) {
      refetch(); // Forzar refetch
    }
  }, [location.state, refetch]);

  const { data: productosData, isLoading: isLoadingProductos } =
    useGetAllProductosQuery({ search: searchTerm });
  const { data: clientes, isLoading: isLoadingClientes } =
    useGetAllClientesQuery();
  /* const { data: metodosPago, isLoading: isLoadingMetodosPago } =
    useGetMetodosDePagoQuery(); */

  const isLoadingAll = isLoading || isLoadingProductos || isLoadingClientes;
  /* isLoadingMetodosPago; */
  // Mapear filas para la tabla
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  const rows = useMemo(() => {
    return data?.transacciones
      ? data?.transacciones.map((row) => ({
          ...row,
          clienteNombre: row.cliente?.nombre || "Sin cliente",
          usuarioNombre: row.usuario?.nombre || "Sin usuario",
          estadoNombre: row.estado?.nombre_estado || "Sin estado",
          sequentialId: row.sequentialId,
          id: row.id_transaccion,
        }))
      : [];
  }, [data?.transacciones]);

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
      flex: 0.4,
      sortable: false,
      resizable: false,
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
    /* {
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
    }, */
    {
      name: "detalles",
      label: "Detalles",
      type: "custom",
      productos: productosData ? productosData.productos : [],
      setSearchTerm, // Pasa la función que actualiza el término de búsqueda
    },
  ];

  const handleSubmit = async (data) => {
    try {
      await createVenta({
        ...data,
        tipo_transaccion: "venta",
        detalles: data.detalles,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Venta creada exitosamente.",
          severity: "success",
        })
      );
      setOpen(false); // Cerrar el modal
      refetch(); // Actualizar la lista automáticamente
    } catch (error) {
      alert("Error al crear venta: " + error.message);
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    navigate(`/ventas/editar/${row.id_transaccion}`, {
      state: { refetch: true },
    });
    // Aquí puedes implementar lógica adicional, como abrir un modal para editar la cotización
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
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (paginationModel) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const rowsPerPageOptions = [5, 10, 25, 50];
  /* if (!rowsPerPageOptions.includes(rowsPerPage)) {
    rowsPerPageOptions.push(rowsPerPage);
  } */

  if (isLoadingAll) return <LoaderComponent />;

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
          name={"Nueva Venta"}
          onClick={() => setOpen(true)}
          disabled={isCreating}
        />
        <Button
          color="error"
          variant="contained"
          onClick={handleOpenDelete}
          disabled={selectedRows.length === 0 || deleteLoading}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
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
          onPaginationModelChange={handlePageChange}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(sequentialIds) => {
            // Mapea sequentialIds a id_transaccion
            const selectedIds = sequentialIds
              .map((sequentialId) => {
                const row = rows.find(
                  (row) => row.sequentialId === sequentialId
                );
                return row?.id_transaccion; // Retorna id_transaccion si la fila es encontrada
              })
              .filter((id) => id); // Filtra IDs no válidos o undefined
            setSelectedRows(selectedIds);
          }}
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
        title={"Crear Venta"}
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

export default Ventas;
