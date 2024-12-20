import React, { useEffect, useState } from "react";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CustomNewButton from "../../../components/common/CustomNewButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useGetAllClientesQuery } from "../../../services/clientesApi";
import { useGetMetodosDePagoQuery } from "../../../services/pagosApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import ModalForm from "../../../components/common/ModalForm";
import AlertDialog from "../../../components/common/AlertDialog";
import { showNotification } from "../../../state/reducers/notificacionSlice";

const Pedidos = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useGetAllTransaccionesQuery({
      tipo_transaccion: "pedido",
      search,
    });

  const [
    createPedido,
    { isLoading: isCreating, isSuccess, error: errorCreate },
  ] = useCreateTransaccionMutation();

  
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
  const { data: metodosPago, isLoading: isLoadingMetodosPago } =
    useGetMetodosDePagoQuery();

  const isLoadingAll =
    isLoading ||
    isLoadingProductos ||
    isLoadingClientes ||
    isLoadingMetodosPago;

  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
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

  const columns = [
    {
      field: "id_transaccion",
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
      flex: 0.6,
      resizable: false,
      renderCell: (params) => {
        return format(new Date(params.value), "dd 'de' MMMM 'de' yyyy, HH:mm", {
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
      options: Array.isArray(clientes)
        ? clientes.map((cliente) => ({
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

  const handleSubmit = async (data) => {
    try {
      await createPedido({
        ...data,
        tipo_transaccion: "pedido",
        detalles: data.detalles,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Pedido creado exitosamente.",
          severity: "success",
        })
      );
      setOpen(false); // Cerrar el modal
      refetch(); // Actualizar la lista automáticamente
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Error al crear pedido: " + error.message);
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    navigate(`/pedidos/editar/${row.id_transaccion}`);
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
          message: "Pedidos eliminados correctamente.",
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
      <Header title="Pedidos" subtitle="Lista de Pedidos" />
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
          /* "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          }, */
        }}
      >
        <CustomNewButton
          name={"Nuevo Pedido"}
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
          loading={isLoading || !data}
          getRowId={(row) => row.id_transaccion}
          rows={rows}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="client"
          sx={{ color: "black", fontWeight: 400, fontSize: "1rem" }}
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
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title={"Crear Pedido"}
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

export default Pedidos;
