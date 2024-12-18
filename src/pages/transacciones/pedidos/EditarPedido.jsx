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
} from "@mui/material";
import {
  useGetTransaccionByIdQuery,
  useChangeEstadoMutation,
  useChangeTipoTransaccionMutation,
  useChangeDetallesInfoMutation,
} from "../../../services/ventasApi";
import { useGetAllEstadosQuery } from "../../../services/estadoTransaccionApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import DetallePedido from "./DetallePedido";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";

const EditarPedido = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productos, isLoading: isLoadingProductos } =
    useGetAllProductosQuery({ search: searchTerm });
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

  const isLoading =
    isLoadingTransaccion ||
    isLoadingEstados ||
    isLoadingProductos ||
    isLoadingChangeEstado ||
    isLoadingChangeTipo ||
    isLoadingChangeDetalles;

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
  
  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
        Editar Pedido
      </Typography>

      <Grid2 container spacing={4} mb={3}>
        <Grid2 xs={12} md={4}>
          <Typography variant="h5" gutterBottom fontWeight="bold" mb={1}>
            Datos del Cliente
          </Typography>
          <TextField
            fullWidth
            label="RUT"
            value={formData.cliente.rut || ""}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nombre"
            value={formData.cliente.nombre || ""}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Dirección"
            value={formData.cliente.direccion || ""}
            disabled
          />
        </Grid2>

        {/* Información del Usuario */}
        <Grid2 xs={12} md={4}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Información del usuario
          </Typography>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.usuario.nombre || ""}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.usuario.email || ""}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rut"
            value={formData.usuario.rut || ""}
            disabled
          />
        </Grid2>

        {/* Información del Estado */}

        <Grid2 xs={12} md={4}>
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

      {/* Información General de la Transacción */}
      <Grid2 container spacing={4} mb={3}>
        <Grid2 xs={12} md={4}>
          <Typography variant="h5" gutterBottom fontWeight="bold" mb={2}>
            Información de la Cotización
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
            <InputLabel id="estado-transaccion">Tipo de Transacción</InputLabel>
            <Select
              value={formData.tipo_transaccion}
              name="tipo_transaccion"
              onChange={handleInputChange}
              label="Tipo de Transacción" 
              id="estado-transaccion-select"
              labelId="estado-transaccion-label"
            >
              <MenuItem value="cotizacion">Cotización</MenuItem>
              <MenuItem value="venta">Venta</MenuItem>
              <MenuItem value="pedido">Pedido</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Fecha de Creación"
            name="fecha_creacion"
            value={
              formData.fecha_creacion
                ? format(new Date(formData.fecha_creacion), "yyyy-MM-dd", {
                    locale: es,
                  })
                : ""
            }
            onChange={handleInputChange}
            disabled
          />
        </Grid2>

        <Grid2 xs={12} md={4}>
          <Typography variant="h5" gutterBottom fontWeight="bold" mb={2}>
            Información de Pago
          </Typography>

          {formData.pagos.length > 0 ? (
            formData.pagos.map((pago, index) => (
              <Box key={index} mb={2} display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Método de Pago"
                  value={pago.metodo?.nombre || "No especificado"}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Estado del Pago"
                  value={pago.estado?.nombre || "No especificado"}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Monto"
                  value={`$${pago.monto.toLocaleString()}`}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Fecha de Pago"
                  value={
                    pago.fecha_pago
                      ? format(new Date(pago.fecha_pago), "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "No disponible"
                  }
                  disabled
                />
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">
              No hay información de pago asociada a este pedido.
            </Typography>
          )}
        </Grid2>
        {/* Detalles de usuario */}
        <Grid2 xs={12} md={4}>
          <Typography variant="h5" gutterBottom fontWeight="bold" mb={2}>
            Chofer Asignado
          </Typography>
          {transaccionData?.usuario_asignado != null ? (
            <Box>
              <TextField
                fullWidth
                label="Nombre"
                value={
                  transaccionData?.usuario_asignado?.nombre || "No asignado"
                }
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Apellido"
                value={
                  transaccionData?.usuario_asignado?.apellido || "No asignado"
                }
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={
                  transaccionData?.usuario_asignado?.email || "No asignado"
                }
                disabled
              />
            </Box>
          ) : (
            <Typography color="textSecondary">
              No hay información de usuario asignado
            </Typography>
          )}
        </Grid2>
      </Grid2>
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

      <Box mt={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/pedidos")}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default EditarPedido;
