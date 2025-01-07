import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useCreateAgendaMutation,
  useGetAllAgendasQuery,
} from "../../services/agendaApi";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BackButton from "../../components/common/BackButton";
import LoaderComponent from "../../components/common/LoaderComponent";
import AlertDialog from "../../components/common/AlertDialog";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import CrearAgenda2 from "../../components/entregas/CrearAgenda2";
import { useGetInventarioQuery } from "../../services/inventarioApi";
import DetallesSelectorWithProducts from "../../components/entregas/ProductosAdicionalesWidget";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";

const AgendaManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createAgenda, { isLoading: isCreating }] = useCreateAgendaMutation();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    data: agendasData,
    isLoading,
    isError,
    refetch,
  } = useGetAllAgendasQuery({
    page: pagination.page,
    date: selectedDate.format("YYYY-MM-DD"),
    limit: pagination.limit,
  });

  const { data: productos, isLoading: loadingProductos } =
    useGetInventarioQuery({
      tipo_producto: "Producto_Terminado",
    });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

  const [productosAdicionales, setProductosAdicionales] = useState([]);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);

  const agendas = agendasData?.agendas || [];
  const paginacion = agendasData?.paginacion || {
    totalPages: 1,
    currentPage: 1,
  };

  const filteredAgendas = agendas.filter((agenda) =>
    dayjs(agenda.fechaHora).isSame(selectedDate, "day")
  );

  const confirmDeleteAgenda = (id) => {
    setSelectedAgendaId(id);
    setOpenAlert(true);
  };

  const handleDeleteAgenda = async () => {
    // Lógica para eliminar agenda
    setOpenAlert(false);
  };

  const handleSubmitAgenda = async (agendaData) => {
    try {
      const fullAgendaData = {
        ...agendaData,
        productosAdicionales: productosAdicionales,
        detalles: detallesSeleccionados.map(
          (detalle) => detalle.id_detalle_transaccion
        ),
      };
      console.log("Datos de la agenda final:", fullAgendaData);
      await createAgenda(fullAgendaData).unwrap();
      dispatch(
        showNotification({
          message: "Agenda de carga creada con éxito",
          severity: "success",
        })
      );
      setOpen(false);
      refetch();
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: `Agenda de carga con errores: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (agendasData?.paginacion) {
      setPagination((prev) => ({
        ...prev,
        totalPages: agendasData.paginacion.total,
      }));
    }
  }, [agendasData]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
    refetch();
  };

  if (isLoading) return <LoaderComponent />;

  if (isError)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar las agendas
        </Typography>
      </Box>
    );

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <BackButton to="/" label="Volver al menú" />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="font-bold text-gray-800">
          Gestión de Agendas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isCreating ? "Creando..." : "Crear Agenda"}
        </Button>
      </Box>

      <Box className="flex flex-col lg:flex-row gap-6">
        {/* Calendario */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box className="w-full lg:w-1/3">
            <Typography
              variant="h5"
              className="mb-4 font-semibold text-gray-800"
            >
              Seleccionar Fecha
            </Typography>
            <DateCalendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="transition duration-300 ease-in-out transform hover:scale-105"
            />
          </Box>
        </LocalizationProvider>

        {/* Tabla de Agendas */}
        <Box className="w-full lg:w-2/3">
          <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
            Agendas para el {selectedDate.format("DD/MM/YYYY")}
          </Typography>
          <Fade in={true} timeout={600}>
            <TableContainer component={Paper} className="shadow-md">
              <Table>
                <TableHead className="bg-gray-200">
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha y Hora</TableCell>
                    <TableCell>Chofer</TableCell>
                    <TableCell>Notas</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAgendas.length > 0 ? (
                    filteredAgendas.map((agenda) => (
                      <TableRow key={agenda.id_agenda_carga}>
                        <TableCell>{agenda.id_agenda_carga}</TableCell>
                        <TableCell>
                          {new Date(agenda.fechaHora).toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell>{agenda.usuario?.nombre}</TableCell>
                        <TableCell>{agenda?.notas || "Sin notas"}</TableCell>
                        <TableCell>
                          <Tooltip title="Editar Agenda">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/agendas/editar/${agenda.id_agenda_carga}`
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar Agenda">
                            <IconButton
                              color="error"
                              onClick={() =>
                                confirmDeleteAgenda(agenda.id_agenda_carga)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay agendas para la fecha seleccionada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={paginacion.totalPages}
              page={paginacion.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Fade in={open}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              p: 4,
              gap: 4,
              backgroundColor: "white",
              borderRadius: "10px",
              width: "90%",
              height: "90vh",
              margin: "auto",
              boxShadow: 24,
            }}
          >
            {/* Modal para Crear Agenda */}
            <Box
              sx={{
                flex: 2,
                overflowY: "auto",
                pr: 2,
              }}
            >
              <CrearAgenda2
                onSubmit={handleSubmitAgenda}
                detallesSeleccionados={detallesSeleccionados}
                setDetallesSeleccionados={setDetallesSeleccionados}
                isCreating={isCreating}
              />
            </Box>

            {/* Widget de Productos Adicionales */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                borderLeft: "1px solid #ccc",
                pl: 2,
              }}
            >
              <DetallesSelectorWithProducts
                productosAdicionales={productosAdicionales}
                setProductosAdicionales={setProductosAdicionales}
                productos={productos?.productos || []}
                loadingProductos={loadingProductos}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>

      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteAgenda}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta agenda? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default AgendaManagement;
