import React, { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/common/Header";
import DataGridCustomToolbar from "../../../components/common/DataGridCustomToolbar";
import {
  useGetAllTransaccionesQuery,
  useCreateTransaccionMutation,
} from "../../../services/ventasApi";
import CustomNewButton from "../../../components/common/CustomNewButton";
import { useGetAllClientesQuery } from "../../../services/clientesApi";
import ModalForm from "../../../components/common/ModalForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useGetMetodosDePagoQuery } from "../../../services/pagosApi";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "../../../components/common/LoaderComponent";

const Cotizaciones = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useGetAllTransaccionesQuery({
    tipo_transaccion: "cotizacion",
    /* sort: JSON.stringify(sort), */
    search,
  });

  const { data: productosData, isLoading: isLoadingProductos } =
    useGetAllProductosQuery({ search: searchTerm });
  const [
    createCotizacion,
    { isLoading: loadinCreate, isError, isSuccess, error: errorCreate },
  ] = useCreateTransaccionMutation();
  const { data: clientes, isLoadingClients } = useGetAllClientesQuery();
  const { data: metodosPago, isLoading: loadingMetodosPago } =
    useGetMetodosDePagoQuery();
  const [selectedRows, setSelectedRows] = useState([]);
  // Modal agregar cotizaciones
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
      flex: 0.4,
      resizable: false,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
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

  // Función para manejar formulario
  const handleSubmit = async (data) => {
    try {
      const response = await createCotizacion({
        ...data, 
        tipo_transaccion: "cotizacion",
        detalles: data.detalles, 
      }).unwrap();

      /**
       * Falta agregar mensajes de alerta cuando se crea
       */
      alert("Cotización creada exitosamente");
    } catch (error) {
      console.error("Error al crear cotización:", error);
      alert("Error al crear cotización: " + error.message);
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    navigate(`/cotizaciones/editar/${row.id_transaccion}`);
  };

  // Función para manejar la acción de eliminar
  const handleDelete = (row) => {
    console.log("Eliminar cotización:", row);
    // Aquí puedes implementar la lógica para eliminar la cotización
  };

  if (isLoading) {
    return <LoaderComponent/>;
  }
  
  if (isError) {
    return <div>Error al crear cotización: {error.message}</div>;
  }
  
  if (isSuccess) {
    navigate(0)
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
          /* "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          }, */
        }}
      >
        <CustomNewButton
          name={"Nueva Cotización"}
          onClick={() => setOpen(true)}
        />
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
        title={"Crear Cotización"}
      />
    </Box>
  );
};

export default Cotizaciones;
