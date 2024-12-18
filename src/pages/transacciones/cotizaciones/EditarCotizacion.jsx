import React, { useState, useEffect, useMemo } from "react";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { API_URL } from "../../../services/apiBase";
import AlertDialog from "../../../components/common/AlertDialog";

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
    refetch,
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
    fecha_creacion: "",
    pagos: [],
  });

  // Mutaciones para las diferentes acciones
  const [changeEstado] = useChangeEstadoMutation();
  const [changeTipo] = useChangeTipoTransaccionMutation();
  const [changeDetalles] = useChangeDetallesInfoMutation();

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
          navigate("/cotizaciones", { state: { refetch: true } });
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
          navigate("/cotizaciones", { state: { refetch: true } });
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
            navigate("/cotizaciones", { state: { refetch: true } }); // Redireccionar al listado
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

  //modal advertencia
  const [openAlert, setOpenAlert] = useState(false);

  // exportar PDF
  const handleExportPdf = async () => {
    try {
      // Realiza la llamada HTTP manualmente

      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL || API_URL
        }/transacciones/exportar-pdf/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error al exportar la cotización");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = `cotizacion_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      dispatch(
        showNotification({
          message: "Cotización exportada correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al exportar la cotización:", error);
      dispatch(
        showNotification({
          message: "Error al exportar la cotización.",
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
        message: "Error al cargar la cotización",
        severity: "error",
      })
    );
    /* return (
      <Typography color="error">Error al cargar la cotización.</Typography>
    ); */
  }
  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Editar Cotización
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setOpenAlert(true)}
      >
        Exportar Cotización
      </Button>

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
      <Typography variant="h6" gutterBottom>
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
            />
            <TextField
              fullWidth
              label="Estado del Pago"
              value={pago.estado?.nombre || "No especificado"}
              disabled
            />
            <TextField
              fullWidth
              label="Monto"
              value={`$${pago.monto.toLocaleString()}`}
              disabled
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
          No hay información de pago asociada a esta transacción.
        </Typography>
      )}
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
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleExportPdf}
        title="Confirmar Exportación"
        message="¿Está seguro de que desea exportar la cotización en formato PDF?"
      />
    </Box>
  );
};

export default EditarCotizacion;
