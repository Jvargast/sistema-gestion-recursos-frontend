import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid2,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  useGetTransaccionByIdQuery,
  useChangeEstadoMutation,
  useChangeTipoTransaccionMutation,
  useChangeDetallesInfoMutation,
  useAsignarTransaccionMutation,
  useEliminarAsignadoTransaccionMutation,
} from "../../../services/ventasApi";
import { useGetAllEstadosQuery } from "../../../services/estadoTransaccionApi";
import { useGetAllChoferesQuery } from "../../../services/usuariosApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import DetallePedido from "./DetallePedido";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import AssignModal from "../../../components/common/AssignModal";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import AlertDialog from "../../../components/common/AlertDialog";
import InfoFieldGroup from "../../../components/common/InfoFieldGroup";

const EditarPedido = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productos, isLoading: isLoadingProductos } =
    useGetAllProductosQuery({ search: searchTerm });

  const { data: choferesData, isLoading: isLoadingChoferes } =
    useGetAllChoferesQuery();
  // Obtener la cotización por ID
  const {
    data: transaccionData,
    isLoading: isLoadingTransaccion,
    isError,
    refetch,
  } = useGetTransaccionByIdQuery(id);

  // Obtener estados desde el backend
  const { data: estadosData, isLoading: isLoadingEstados } =
    useGetAllEstadosQuery({
      tipo_transaccion: "pedido",
    });

  // Estado para el formulario
  const [formData, setFormData] = useState({
    cliente: {},
    usuario: {},
    estado: {},
    detalles: [],
    tipo_transaccion: "",
    total: "",
    observaciones: "",
    fecha_creacion: "",
    pagos: [],
    usuarioAsignado: {},
  });

  // Mutaciones para las diferentes acciones
  const [changeEstado, { isLoading: isLoadingChangeEstado }] =
    useChangeEstadoMutation();
  const [changeTipo, { isLoading: isLoadingChangeTipo }] =
    useChangeTipoTransaccionMutation();
  const [changeDetalles, { isLoading: isLoadingChangeDetalles }] =
    useChangeDetallesInfoMutation();
  const [asignarTransaccion, { isLoading: isAssigning }] =
    useAsignarTransaccionMutation();
  const [removeChofer, { isLoading: isRemovingChofer }] =
    useEliminarAsignadoTransaccionMutation();

  const isLoading =
    isLoadingTransaccion ||
    isLoadingEstados ||
    isLoadingProductos ||
    isLoadingChangeEstado ||
    isLoadingChangeTipo ||
    isLoadingChangeDetalles ||
    isLoadingChoferes;

  // Modal Asignar
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);
  const [selectedChofer, setSelectedChofer] = useState("");

  // Modal para eliminar
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const detallesInicializados = useMemo(() => {
    if (!transaccionData?.detalles) return [];
    return transaccionData.detalles.map((detalle) => ({
      id_detalle_transaccion: detalle.id_detalle_transaccion,
      cantidad: detalle.cantidad || 0,
      precio_unitario: detalle.precio_unitario || 0,
      subtotal: detalle.subtotal || 0,
      id_producto: detalle.id_producto,
      producto: detalle.producto,
      estado_producto_transaccion: detalle.estado_producto_transaccion,
      estado: detalle.estado || {},
    }));
  }, [transaccionData]);

  useEffect(() => {
    if (transaccionData) {
      setFormData({
        cliente: transaccionData.transaccion.cliente || {},
        usuario: transaccionData.transaccion.usuario || {},
        estado: transaccionData.transaccion.estado || {},
        detalles: detallesInicializados,
        tipo_transaccion: transaccionData.transaccion.tipo_transaccion || "",
        total: transaccionData.transaccion.total || "",
        observaciones: transaccionData.transaccion.observaciones || "",
        fecha_creacion: transaccionData.transaccion.fecha_creacion || "",
        pagos: transaccionData.pago || [],
        usuarioAsignado: transaccionData.usuario_asignado || {},
      });
    }
  }, [transaccionData, detallesInicializados]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case "changeEstado":
          await changeEstado({
            id,
            id_estado_transaccion: formData.estado,
          }).unwrap();
          dispatch(
            showNotification({
              message: "Estado actualizado exitosamente",
              severity: "success",
            })
          );
          navigate("/pedidos", { state: { refetch: true } });
          break;
        case "changeTipo":
          await changeTipo({
            id,
            tipo_transaccion: formData.tipo_transaccion,
          }).unwrap();
          dispatch(
            showNotification({
              message: "Tipo de transacción actualizado exitosamente",
              severity: "success",
            })
          );
          navigate("/pedidos", { state: { refetch: true } });
          break;
        case "actualizarDetalles":
          const detallesPreparados = formData.detalles.map((detalle) => {
            if (!detalle.id_detalle_transaccion) {
              return { ...detalle, nuevo: true }; // Marcar nuevos detalles
            }
            return detalle;
          });

          try {
            // Realizar la mutación
            const response = await changeDetalles({
              id,
              detalles: detallesPreparados,
            }).unwrap();
            await refetch();
            dispatch(
              showNotification({
                message:
                  response.message || "Detalles actualizados exitosamente",
                severity: "success",
              })
            );
            navigate("/pedidos", { state: { refetch: true } }); // Redireccionar al listado
          } catch (error) {
            dispatch(
              showNotification({
                message: `Error: ${
                  error.data?.error || "No se pudo actualizar"
                }`,
                severity: "error",
              })
            );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el pedido",
        severity: "error",
      })
    );
    return (
      <Typography color="error">Error al cargar la cotización.</Typography>
    );
  }

  const handleOpenAssignModal = (idTransaccion) => {
    setSelectedTransaccion(idTransaccion);
    setOpenAssignModal(true);
  };
  const handleAssign = async (chofer) => {
    try {
      if (!chofer || !selectedTransaccion) return;
      // Llama al hook de RTK Query para asignar la transacción
      await asignarTransaccion({
        id_transaccion: selectedTransaccion,
        id_usuario: chofer.rut,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Chofer asignado con éxito.",
          severity: "success",
        })
      );

      setOpenAssignModal(false);
      refetch(); // Actualizar la lista de transacciones
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al asignar chofer. ${error.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleOpenDelete = () => {
    setOpenAlert(true);
  };

  const handleRemoveChofer = async () => {
    try {
      setDeleteLoading(true);
      await removeChofer(id).unwrap();
      dispatch(
        showNotification({
          message: "Chofer eliminado correctamente.",
          severity: "success",
        })
      );
      refetch(); // Refrescar los datos de la transacción
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar chofer: ${
            error.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Box m={1.5}>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
        Editar Pedido
      </Typography>
      <Box
        flexDirection="row"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid2 container spacing={3} display="flex" justifyContent="center">
          <Grid2 xs={12} sm={4} md={6} width={"30%"}>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb={1}>
              Datos del Cliente
            </Typography>
            <TextField
              fullWidth
              label="RUT"
              value={formData.cliente.rut || ""}
              disabled
              sx={{ mb: 2, fontSize: "1.1rem" }}
            />
            <TextField
              fullWidth
              label="Nombre"
              value={formData.cliente.nombre || ""}
              disabled
              sx={{ mb: 2, fontSize: "1.1rem" }}
            />
            <TextField
              fullWidth
              label="Dirección"
              value={formData.cliente.direccion || ""}
              disabled
              sx={{ fontSize: "1.1rem" }}
            />
          </Grid2>

          {/* Información del Usuario */}
          <Grid2 xs={12} sm={4} md={6} width={"30%"}>
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Información del usuario creador
            </Typography>
            <TextField
              fullWidth
              label="Nombre"
              value={
                `${formData.usuario.nombre + formData.usuario.apellido}` || ""
              }
              disabled
              sx={{ mb: 2, fontSize: "1.1rem" }}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.usuario.email || ""}
              disabled
              sx={{ mb: 2, fontSize: "1.1rem" }}
            />
            <TextField
              fullWidth
              label="Rut"
              value={formData.usuario.rut || ""}
              disabled
              sx={{ fontSize: "1.1rem" }}
            />
          </Grid2>

          {/* Información del Estado */}
          <Grid2 xs={12} sm={4} md={6} >
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Estado Cotización
            </Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                label="Estado"
                id="estado-select"
                value={formData.estado.id_estado_transaccion || ""}
                name="estado"
                sx={{ fontSize: "1.1rem" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estado: {
                      ...prev.estado,
                      id_estado_transaccion: e.target.value,
                    },
                  }))
                }
              >
                {estadosData?.map((estado) => (
                  <MenuItem
                    key={estado.id_estado_transaccion}
                    value={estado.id_estado_transaccion}
                  >
                    {estado.nombre_estado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
      </Box>

      {/* Información General de la Transacción */}
      <Divider sx={{ my: 3 }} />
      <Box
        /* flexDirection="row"
        display="flex"
        alignItems="center"
        justifyContent="center" */
      >
        <Grid2 container spacing={3} /* mb={3} */ display="flex" justifyContent="center">
          <Grid2 xs={12} md={4} sm={6} width={"30%"}>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb={2}>
              Información de la Cotización
            </Typography>
            <InfoFieldGroup
              fields={[
                {
                  type: "select",
                  label: "Tipo de Transacción",
                  value: formData.tipo_transaccion,
                  onChange: handleInputChange,
                  name: "tipo_transaccion",
                  options: [
                    { value: "cotizacion", label: "Cotización" },
                    { value: "venta", label: "Venta" },
                    { value: "pedido", label: "Pedido" },
                  ],
                },
                {
                  type: "text",
                  label: "Observaciones",
                  value: formData.observaciones,
                  onChange: handleInputChange,
                  name: "observaciones",
                  disabled: true,
                },
                {
                  type: "date",
                  label: "Fecha de Creación",
                  value: formData.fecha_creacion
                    ? format(new Date(formData.fecha_creacion), "yyyy-MM-dd", {
                        locale: es,
                      })
                    : "",
                  onChange: handleInputChange,
                  name: "fecha_creacion",
                  disabled: true,
                },
              ]}
            />
          </Grid2>

          <Grid2 xs={12} md={4} sm={6} width={"30%"}>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb={2}>
              Información de Pago
            </Typography>

            {formData.pagos.length > 0 ? (
              formData.pagos.map((pago, index) => (
                <InfoFieldGroup
                  key={index}
                  fields={[
                    {
                      label: "Método de Pago",
                      value: pago.metodo?.nombre || "No especificado",
                    },
                    {
                      label: "Estado del Pago",
                      value: pago.estado?.nombre || "No especificado",
                      disabled: true,
                    },
                    {
                      label: "Fecha de Pago",
                      value: pago.fecha_pago
                        ? format(new Date(pago.fecha_pago), "dd/MM/yyyy", {
                            locale: es,
                          })
                        : "No disponible",
                      disabled: true,
                    },
                  ]}
                />
              ))
            ) : (
              <Typography color="textSecondary" fontSize={"1.2rem"}>
                No hay información de pago asociada a este pedido.
              </Typography>
            )}
          </Grid2>

          {/*  Chofer Asignado */}
          <Grid2 xs={12} md={4} sm={6}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Chofer Asignado
              </Typography>
              {/*  <Box display="flex" gap={1}> */}
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenAssignModal(id);
                }}
                disabled={isAssigning}
              >
                <PersonAddAlt1OutlinedIcon />
              </IconButton>
              {transaccionData?.usuario_asignado && (
                <IconButton
                  color="error"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDelete();
                  }}
                  disabled={isRemovingChofer}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              {/* </Box> */}
            </Box>
            {transaccionData?.usuario_asignado != null ? (
              <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={
                    transaccionData?.usuario_asignado?.nombre || "No asignado"
                  }
                  disabled
                  sx={{
                    mb: 1,
                    maxWidth: "250px",
                    "& .MuiInputBase-input": { fontSize: "1.1rem" },
                    "& .MuiInputLabel-root": { fontSize: "1.2rem" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  value={
                    transaccionData?.usuario_asignado?.apellido || "No asignado"
                  }
                  disabled
                  sx={{
                    mb: 1,
                    maxWidth: "250px",
                    "& .MuiInputBase-input": { fontSize: "1.1rem" },
                    "& .MuiInputLabel-root": { fontSize: "1.2rem" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={
                    transaccionData?.usuario_asignado?.email || "No asignado"
                  }
                  disabled
                  sx={{
                    maxWidth: "250px",
                    "& .MuiInputBase-input": { fontSize: "1.1rem" },
                    "& .MuiInputLabel-root": { fontSize: "1.2rem" },
                  }}
                />
              </Box>
            ) : (
              <Typography color="textSecondary">
                No hay información de usuario asignado
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* Detalles de Productos */}
      <DetallePedido
        detallesIniciales={formData.detalles}
        productos={productos || []}
        onDetallesChange={(updatedDetalles) => {
          setFormData((prev) => ({
            ...prev,
            detalles: updatedDetalles,
          }));
        }}
        setSearchTerm={setSearchTerm}
        idTransaccion={id}
      />

      {/* Botones de Acción */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/pedidos")}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAction("changeEstado")}
        >
          Cambiar Estado
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleAction("changeTipo")}
        >
          Cambiar Tipo
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAction("actualizarDetalles")}
        >
          Actualizar Detalles
        </Button>
      </Box>
      <AssignModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        onSubmit={handleAssign}
        choferes={choferesData || []}
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleRemoveChofer}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar al chofer?`}
      />
    </Box>
  );
};

export default EditarPedido;
