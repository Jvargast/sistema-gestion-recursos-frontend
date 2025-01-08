import React, { useState } from "react";
import { useGetCamionCapacityQuery } from "../../services/camionesApi";

import LoaderComponent from "../../components/common/LoaderComponent";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import {
  useFinalizeAgendaMutation,
  useGetAgendasByChoferQuery,
  useStartAgendaMutation,
} from "../../services/agendaApi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { useCreateEntregaMutation } from "../../services/entregasApi";
import { format } from "date-fns";
import { useReturnProductsMutation } from "../../services/inventarioCamionApi";

const EntregasManagement = () => {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchAgendas,
  } = useGetAgendasByChoferQuery({
    fecha: `${format(new Date(), "yyyy-MM-dd")}`,
  });
  const agendasPendientes = data?.agendasPendientes || [];
  const agendasEnTransito = data?.agendasEnTransito || [];
  const agendasFinalizadas = data?.agendasFinalizadas || [];

  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [startAgenda] = useStartAgendaMutation();
  const [finalizeAgenda] = useFinalizeAgendaMutation();

  // Determinar el ID del camión de la primera agenda pendiente
  const id_camion =
    agendasPendientes.length > 0
      ? agendasPendientes[0]?.camion?.id_camion
      : agendasEnTransito.length > 0
      ? agendasEnTransito[0]?.camion?.id_camion
      : null;

  // Obtener la capacidad del camión
  const {
    data: camionCapacity,
    isLoading: isLoadingCapacity,
    isError: isErrorCapacity,
  } = useGetCamionCapacityQuery(id_camion, { skip: !id_camion });

  const [expandedAgenda, setExpandedAgenda] = useState(null);
  const [createEntrega] = useCreateEntregaMutation();
  const [returnProducts] = useReturnProductsMutation();

  if (isLoading || isLoadingCapacity) return <LoaderComponent />;
  if (isError || isErrorCapacity) return <Typography>Error al cargar las agendas</Typography>;

  const toggleAgendaDetails = (id) => {
    setExpandedAgenda((prev) => (prev === id ? null : id));
  };
  const handleOpenModal = (detalle, id_camion) => {
    setSelectedDetalle({ ...detalle, id_camion });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDetalle(null);
    setModalOpen(false);
  };
  // Manejar inicio de agenda
  const handleStartAgenda = async (id) => {
    try {
      await startAgenda(id).unwrap();
      dispatch(
        showNotification({
          message: "Comienzo del viaje",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al iniciar la agenda:", error);
      dispatch(
        showNotification({
          message: `Error al iniciar el recorrido: ${error}`,
          severity: "error",
        })
      );
    }
  };

  // Manejar finalización de agenda
  const handleFinalizeAgenda = async (id) => {
    try {
      await finalizeAgenda(id).unwrap();

      dispatch(
        showNotification({
          message: "Finalización del viaje",
          severity: "success",
        })
      );
      refetchAgendas();
    } catch (error) {
      console.error("Error al finalizar la agenda:", error);
      dispatch(
        showNotification({
          message: `Error al finalizar el recorrido: ${error}`,
          severity: "error",
        })
      );
    }
  };

  const handleReturnProducts = async (id_camion) => {
    try {
      const result = await returnProducts(id_camion).unwrap();
      refetchAgendas();
      dispatch(
        showNotification({
          message: `Devolución exitosa: ${result.message}`,
          severity: "success",
        })
      );
      // Verifica si el inventario quedó en 0
      if (camionCapacity?.capacidadUtilizada === 0) {
        dispatch(
          showNotification({
            message: "Todos los productos han sido devueltos.",
            severity: "info",
          })
        );
      }
    } catch (error) {
      console.error("Error al devolver productos:", error);
      dispatch(
        showNotification({
          message: `Error al devolver productos: ${error.message}`,
          severity: "error",
        })
      );
    }
  };

  const handleCreateEntrega = async () => {
    try {
      const fechaHoraEntrega = new Date().toISOString();
      const { id_camion, id_detalle_transaccion } = selectedDetalle;
      await createEntrega({
        id_camion,
        detalles: [id_detalle_transaccion],
        fechaHoraEntrega,
      }).unwrap();
      setModalOpen(false);
      dispatch(
        showNotification({
          message: "Se ha realizado la entrega con éxito",
          severity: "success",
        })
      );
      refetchAgendas();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error:` + error.message,
        })
      );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Agendas
      </Typography>

      {id_camion && camionCapacity && camionCapacity.capacidadUtilizada > 0 ? (
        <Typography variant="h5" component="h2" gutterBottom>
          Capacidad del Camión: {camionCapacity.capacidadUtilizada}/
          {camionCapacity.capacidadTotal} ({camionCapacity.capacidadDisponible}{" "}
          disponible)
        </Typography>
      ) : (
        <Typography variant="h5" component="h2" gutterBottom>
          El camión está vacío. Recargue el inventario para continuar.
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Agendas Pendientes */}
        <Box
          sx={{ flex: 1, backgroundColor: "#fff3e0", p: 3, borderRadius: 2 }}
        >
          <Typography variant="h5" gutterBottom>
            Agendas Pendientes ⏳
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {agendasPendientes.map((agenda) => (
            <Box key={agenda.id_agenda_carga} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Camión: {agenda.camion.placa} - Fecha:{" "}
                  {new Date(agenda.fechaHora).toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStartAgenda(agenda.id_agenda_carga)}
                >
                  Iniciar Agenda
                </Button>
                <IconButton
                  onClick={() => toggleAgendaDetails(agenda.id_agenda_carga)}
                >
                  {expandedAgenda === agenda.id_agenda_carga ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse
                in={expandedAgenda === agenda.id_agenda_carga}
                timeout="auto"
                unmountOnExit
              >
                <List>
                  {agenda.detalles.map((detalle) => (
                    <ListItem
                      key={detalle.id_detalle_transaccion}
                      sx={{ mb: 2 }}
                    >
                      <ListItemText
                        primary={`Producto: ${detalle.producto.nombre_producto}`}
                        secondary={
                          <>
                            <Typography>
                              Cantidad: {detalle.cantidad}
                            </Typography>
                            <Typography>
                              Cliente: {detalle.cliente.nombre}{" "}
                              {detalle.cliente.apellido}
                            </Typography>
                            <Typography>
                              Dirección: {detalle.cliente.direccion}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
          {agendasPendientes.length === 0 && (
            <Typography>No hay agendas pendientes.</Typography>
          )}
        </Box>

        {/* Agendas En Tránsito */}
        <Box
          sx={{ flex: 1, backgroundColor: "#fffde7", p: 3, borderRadius: 2 }}
        >
          <Typography variant="h5" gutterBottom>
            Agendas En Tránsito 🚚
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {agendasEnTransito.length > 0 ? (
            agendasEnTransito.map((agenda) => (
              <Box key={agenda.id_agenda_carga} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    Camión: {agenda.camion.placa} - Fecha:{" "}
                    {new Date(agenda.fechaHora).toLocaleString()}
                  </Typography>
                  <IconButton
                    onClick={() => toggleAgendaDetails(agenda.id_agenda_carga)}
                  >
                    {expandedAgenda === agenda.id_agenda_carga ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse
                  in={expandedAgenda === agenda.id_agenda_carga}
                  timeout="auto"
                  unmountOnExit
                >
                  {agenda.detalles.length > 0 ? (
                    <List>
                      {agenda.detalles.map((detalle) => (
                        <ListItem
                          key={detalle.id_detalle_transaccion}
                          sx={{ mb: 2 }}
                        >
                          <ListItemText
                            primary={`Producto: ${detalle.producto.nombre_producto}`}
                            secondary={
                              <>
                                <Typography>
                                  Cantidad: {detalle.cantidad}
                                </Typography>
                                <Typography>
                                  Cliente: {detalle.cliente.nombre}{" "}
                                  {detalle.cliente.apellido}
                                </Typography>
                                <Typography>
                                  Dirección: {detalle.cliente.direccion}
                                </Typography>
                              </>
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleOpenModal(detalle, agenda.camion.id_camion)
                            }
                          >
                            Crear Entrega
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No hay detalles para entregar.</Typography>
                  )}
                </Collapse>
              </Box>
            ))
          ) : (
            <Typography>No hay agendas en tránsito.</Typography>
          )}
        </Box>

        {/* Agendas Finalizadas */}
        <Box
          sx={{ flex: 1, backgroundColor: "#e8f5e9", p: 3, borderRadius: 2 }}
        >
          <Typography variant="h5" gutterBottom>
            Agendas Finalizadas ✔️
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {agendasFinalizadas.map((agenda) => (
            <Box key={agenda.id_agenda_carga} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Camión: {agenda.camion.placa} - Fecha:{" "}
                  {new Date(agenda.fechaHora).toLocaleString()}
                </Typography>
                {/* Botón para terminar el viaje */}
                {agenda.estado_camion === "En Ruta" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleFinalizeAgenda(agenda.id_agenda_carga)}
                  >
                    Terminar Viaje
                  </Button>
                )}

                {/* Botón para devolver los productos */}
                {agenda.estado_camion === "Finalizado" &&
                  /* camionCapacity?.capacidadUtilizada === 0 && */ (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleReturnProducts(agenda.camion.id_camion)
                      }
                    >
                      Devolver Productos
                    </Button>
                  )}
                <IconButton
                  onClick={() => toggleAgendaDetails(agenda.id_agenda_carga)}
                >
                  {expandedAgenda === agenda.id_agenda_carga ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse
                in={expandedAgenda === agenda.id_agenda_carga}
                timeout="auto"
                unmountOnExit
              >
                <List>
                  {agenda.detalles.map((detalle) => (
                    <ListItem
                      key={detalle.id_detalle_transaccion}
                      sx={{ mb: 2 }}
                    >
                      <ListItemText
                        primary={`Producto: ${detalle.producto.nombre_producto}`}
                        secondary={
                          <>
                            <Typography>
                              Cantidad: {detalle.cantidad}
                            </Typography>
                            <Typography>
                              Cliente: {detalle.cliente.nombre}{" "}
                              {detalle.cliente.apellido}
                            </Typography>
                            <Typography>
                              Dirección: {detalle.cliente.direccion}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
          {agendasFinalizadas.length === 0 && (
            <Typography>No hay agendas finalizadas.</Typography>
          )}
        </Box>
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirmar Entrega
          </Typography>
          {selectedDetalle && (
            <>
              <Typography>
                Producto: {selectedDetalle.producto.nombre_producto}
              </Typography>
              <Typography>Cantidad: {selectedDetalle.cantidad}</Typography>
              <Typography>
                Cliente: {selectedDetalle.cliente.nombre}{" "}
                {selectedDetalle.cliente.apellido}
              </Typography>
              <Typography>
                Dirección: {selectedDetalle.cliente.direccion}
              </Typography>
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" onClick={handleCreateEntrega}>
              Confirmar
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EntregasManagement;
