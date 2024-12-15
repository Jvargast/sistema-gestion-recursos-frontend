import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  useGetTransaccionByIdQuery,
  useChangeEstadoMutation,
  useChangeTipoTransaccionMutation,
  useChangeDetallesInfoMutation,
} from "../../../services/ventasApi";
import { useGetAllEstadosQuery } from "../../../services/estadoTransaccionApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import DetalleTransaccion from "./DetalleTransaccion";
import { useGetAllProductosQuery } from "../../../services/inventarioApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";

const EditarCotizacion = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productos } = useGetAllProductosQuery({ search: searchTerm });
  // Obtener la cotización por ID
  const {
    data: transaccionData,
    isLoading,
    isError,
    refetch
  } = useGetTransaccionByIdQuery(id);

  // Obtener estados desde el backend
  const { data: estadosData } = useGetAllEstadosQuery({
    tipo_transaccion: "cotizacion",
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
  });

  // Mutaciones para las diferentes acciones
  const [changeEstado] = useChangeEstadoMutation();
  const [changeTipo] = useChangeTipoTransaccionMutation();
  const [changeDetalles] = useChangeDetallesInfoMutation();

  useEffect(() => {
    if (transaccionData) {
      setFormData({
        cliente: transaccionData.transaccion.cliente || {},
        usuario: transaccionData.transaccion.usuario || {},
        estado: transaccionData.transaccion.estado || {},
        detalles: transaccionData.detalles.map(detalle => ({
          id_detalle_transaccion: detalle.id_detalle_transaccion, // Incluye el campo aquí
          cantidad: detalle.cantidad || 0,
          precio_unitario: detalle.precio_unitario || 0,
          subtotal: detalle.subtotal || 0,
          id_producto: detalle.id_producto,
          producto: detalle.producto,
          estado_producto_transaccion: detalle.estado_producto_transaccion,
          estado: detalle.estado || {}
        })) || [],
        tipo_transaccion: transaccionData.transaccion.tipo_transaccion || "",
        total: transaccionData.transaccion.total || "",
        observaciones: transaccionData.transaccion.observaciones || "",
      });
    }
  }, [transaccionData]);
 
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
          dispatch(showNotification({ message: "Estado actualizado exitosamente", severity: "success" }));
          break;
        case "changeTipo":
          await changeTipo({
            id,
            tipo_transaccion: formData.tipo_transaccion,
          }).unwrap();
          dispatch(showNotification({ message: "Tipo de transacción actualizado exitosamente", severity: "success" }));
          break;
        case "actualizarDetalles":
          const detallesPreparados = formData.detalles.map((detalle) => {
            if (!detalle.id_detalle_transaccion) {
              // Si no tiene id_detalle_transaccion, se marca para creación
              return {
                ...detalle,
                nuevo: true, // Este flag puede ser interpretado por el backend
              };
            }
            return detalle;
          });
  
          await changeDetalles({
            id,
            detalles: detallesPreparados,
          }).unwrap();
  
          dispatch(
            showNotification({
              message: "Detalles actualizados exitosamente",
              severity: "success",
            })
          );
          await refetch(); // <-- Refresca los datos después de actualizar
          break;

        default:
          break;
      }
    } catch (error) {
      dispatch(showNotification({ message: `Error: ${error.data.error}`, severity: "error" }));
    }
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    dispatch(showNotification({ message: "Error al cargar la cotización", severity: "error" }));
    return (
      <Typography color="error">Error al cargar la cotización.</Typography>
    );
  }

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Editar Cotización
      </Typography>

      <Typography variant="h6" gutterBottom>
        Datos del Cliente
      </Typography>
      <TextField
        fullWidth
        label="RUT"
        value={formData.cliente.rut || ""}
        disabled
      />
      <TextField
        fullWidth
        label="Nombre"
        value={formData.cliente.nombre || ""}
        disabled
      />
      <TextField
        fullWidth
        label="Dirección"
        value={formData.cliente.direccion || ""}
        disabled
      />

      {/* Información del Usuario */}

      <Typography variant="h6" gutterBottom>
        Información del usuario
      </Typography>
      <TextField
        fullWidth
        label="Nombre"
        value={formData.usuario.nombre || ""}
        disabled
      />
      <TextField
        fullWidth
        label="Email"
        value={formData.usuario.email || ""}
        disabled
      />
      <TextField
        fullWidth
        label="Rut"
        value={formData.usuario.rut || ""}
        disabled
      />

      {/* Información del Estado */}

      <Typography variant="h6" gutterBottom>
        Estado
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Estado</InputLabel>
        <Select
          value={formData.estado.id_estado_transaccion || ""}
          name="estado"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              estado: { ...prev.estado, id_estado_transaccion: e.target.value },
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
      {/* Información General de la Transacción */}
      <Typography variant="h6" gutterBottom>
        Información de la Cotización
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Tipo de Transacción</InputLabel>
        <Select
          value={formData.tipo_transaccion}
          name="tipo_transaccion"
          onChange={handleInputChange}
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
      />
      {/* Detalles de Productos */}
      <DetalleTransaccion
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
          onClick={() => navigate("/cotizaciones")}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default EditarCotizacion;
