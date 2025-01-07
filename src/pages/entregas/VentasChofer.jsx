import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetVentasChoferQuery,
  useRealizarVentaRapidaMutation,
} from "../../services/ventasChoferApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import Header from "../../components/common/Header";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolbar";
import { CustomPagination } from "../../components/common/CustomPagination";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";
import ModalVentaRapidaChofer from "../../components/ventasChofer/ModalVentaRapidaChofer";
import CustomNewButton from "../../components/common/CustomNewButton";
import { useGetInventarioDisponibleQuery } from "../../services/inventarioCamionApi";
import { useGetAgendaActivaQuery } from "../../services/agendaApi";
import { useGetAllClientesQuery } from "../../services/clientesApi";
import ModalCrearCliente from "../../components/ventasChofer/ModalCrearCliente";

const VentasChofer = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchClient, setSearchClient] = useState("");
  const [pageClient, setPageClient] = useState(0);
  const [pageSizeClient, setSizeClient] = useState(3);

  const [openCrearCliente, setOpenCrearCliente] = useState(false);

  const { data: agendaData, isLoading: loadingAgenda } =
    useGetAgendaActivaQuery();
  const idCamion = agendaData?.data?.camion?.id_camion;

  const dispatch = useDispatch();

  const { data, isLoading, isError, error, refetch } = useGetVentasChoferQuery({
    search,
    page: page + 1, // La API espera la página 1-indexada
    limit: pageSize,
  });

  const { data: productosData, isLoading: isLoadingProductos } =
    useGetInventarioDisponibleQuery(
      { id_camion: idCamion, search: searchTerm },
      {
        skip: !idCamion, // Evita la consulta hasta que `idCamion` esté disponible
      }
    );
  const {
    data: clientesData,
    isLoading: isLoadingClientes,
    refetch: refetchClientes,
  } = useGetAllClientesQuery({
    search: searchClient, // Búsqueda basada en el texto ingresado
    page: pageClient + 1, // API espera páginas 1-indexadas
    limit: pageSizeClient,
  });

  const [clientesDatas, setClientesDatas] = useState({ clientes: [] }); // Clientes inicializados como un array vacío

  useEffect(() => {
    if (clientesData) {
      setClientesDatas({ clientes: clientesData.clientes || [] });
    }
  }, [clientesData]);

  const handleClienteCreado = (nuevoCliente) => {
    // Aquí puedes actualizar la lista de clientes localmente
    setClientesDatas((prev) => ({
      ...prev,
      clientes: Array.isArray(prev.clientes)
        ? [...prev.clientes, nuevoCliente]
        : [nuevoCliente],
    }));
    setOpenCrearCliente(false); // Cierra el modal
  };

  const [realizarVentaRapida, { isLoading: isCreating }] =
    useRealizarVentaRapidaMutation();

  const rows = useMemo(() => {
    return (
      data?.ventasChofer?.map((venta) => ({
        ...venta,
        id: venta.id_venta_chofer,
        clienteNombre: venta.cliente?.nombre || "Sin cliente",
        camionPlaca: venta.camion?.placa || "Sin información",
        metodoPagoNombre: venta.metodoPago?.nombre || "Sin información",
      })) || []
    );
  }, [data?.ventasChofer]);

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
      field: "camionPlaca",
      headerName: "Placa del Camión",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "metodoPagoNombre",
      headerName: "Método de Pago",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "total_venta",
      headerName: "Total Venta",
      flex: 0.4,
      resizable: false,
      renderCell: (params) => `$${Number(params.value || 0).toLocaleString()}`,
    },
    {
      field: "fechaHoraVenta",
      headerName: "Fecha Venta",
      flex: 0.5,
      resizable: false,
      renderCell: (params) => {
        return format(new Date(params.value), "dd-MM-yyyy HH:mm", {
          locale: es,
        });
      },
    },
    {
      field: "estadoPago",
      headerName: "Estado Pago",
      flex: 0.4,
      resizable: false,
    },
  ];

  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);

  const handlePageChange = (paginationModel) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const rowsPerPageOptions = [5, 10, 25, 50];

  if (isLoading || loadingAgenda || (isLoadingProductos && idCamion))
    return <LoaderComponent />;

  if (isError) {
    return (
      <Box>
        <p>Error al cargar las ventas del chofer: {error?.message}</p>
      </Box>
    );
  }

  const handleCreateVenta = async (data) => {
    try {
      await realizarVentaRapida(data).unwrap();
      dispatch(
        showNotification({
          message: "Venta rápida registrada con éxito",
          severity: "success",
        })
      );
      setOpen(false); // Cerrar el modal
      refetch(); // Actualizar la lista automáticamente
    } catch (error) {
      console.error("Error al registrar la venta rápida:", error);
      dispatch(
        showNotification({
          message: `Error al registrar la venta rápida:` + error?.data.detalle,
          severity: "error",
        })
      );
    }
  };

  const fields = [
    {
      name: "cliente_rut",
      label: "Cliente",
      type: "select",
      searchable: true,
      options:
        clientesDatas?.clientes?.map((cliente) => ({
          value: cliente.rut,
          label: cliente.nombre,
        })) || [],
      defaultValue: "",
      setSearchTerm: setSearchInput,
      route: "/clientes/crear",
      searchOption: "Agregar Nuevo Cliente",
      onCreateNewClient: () => setOpenCrearCliente(true),
    },
    {
      name: "id_camion",
      label: "Camión",
      type: "text",
      defaultValue: idCamion || "",
      disabled: true, // Solo lectura
    },
    {
      name: "productos",
      label: "Productos",
      type: "custom",
      productos: productosData || [],
      setSearchTerm, // Manejo de búsqueda
    },
    {
      name: "metodo_pago",
      label: "Método de Pago",
      type: "select",
      options: [
        { value: 1, label: "Efectivo" },
        { value: 2, label: "Tarjeta crédito" },
        { value: 3, label: "Tarjeta débito" },
        { value: 4, label: "Transferencia" },
      ],
      defaultValue: "",
    },
    {
      name: "monto",
      label: "Monto Total",
      type: "number",
      defaultValue: "",
    },
    {
        name: "referencia",
        label: "Referencia de Pago",
        type: "text",
        defaultValue: "",
      },
    
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Ventas del Chofer" subtitle="Lista de Ventas Realizadas" />

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
          name={"Nueva Venta Rápida"}
          onClick={() => setOpen(true)}
          disabled={isCreating}
        />
        <DataGrid
          loading={isLoading || !data?.ventasChofer}
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          rowCount={paginacion?.totalItems || rows.length}
          paginationMode="server"
          paginationModel={{
            pageSize: pageSize,
            page: page,
          }}
          onPaginationModelChange={handlePageChange}
          pagination
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
      <ModalVentaRapidaChofer
        open={open}
        onSubmit={handleCreateVenta}
        onClose={() => setOpen(false)}
        fields={fields}
        title={"Productos"}
      />
      <ModalCrearCliente
        open={openCrearCliente}
        onClose={() => setOpenCrearCliente(false)}
        onClienteCreado={handleClienteCreado}
      />
    </Box>
  );
};

export default VentasChofer;
