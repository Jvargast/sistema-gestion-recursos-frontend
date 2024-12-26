import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetPagoByIdQuery,
  useUpdatePagoMutation,
} from "../../services/pagosApi";
import { showNotification } from "../../state/reducers/notificacionSlice";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  Divider,
  Paper,
  Grid2,
} from "@mui/material";
import LoaderComponent from "../../components/common/LoaderComponent";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";
import NavigationButton from "../../components/common/NavigationButton";

const EditarPago = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Obtener datos del pago
  const {
    data: pagoData,
    isLoading,
    isError,
    refetch,
  } = useGetPagoByIdQuery(id);

  // Mutación para actualizar el pago
  const [updatePago, { isLoading: isUpdating }] = useUpdatePagoMutation();

  // Estado del formulario
  const [selectedAction, setSelectedAction] = useState("");
  const [formData, setFormData] = useState({
    monto: "",
    referencia: "",
    id_metodo_pago: "",
    id_pago: "",
    fecha_pago: "",
    estado: {},
    metodo: {},
    transaccionPago: {},
    cliente: {},
    usuario: {},
  });

  useEffect(() => {
    if (pagoData) {
      setFormData({
        monto: pagoData?.pago?.monto || "",
        referencia: pagoData?.pago?.referencia || "",
        id_metodo_pago: pagoData?.pago?.id_metodo_pago || "",
        id_pago: pagoData?.pago?.id_pago || "",
        fecha_pago: pagoData?.pago?.fecha_pago || "",
        estado: pagoData?.pago?.metodo || {},
        metodo: pagoData?.pago?.estado || {},
        transaccionPago: pagoData?.pago?.transaccionPago || {},
        cliente: pagoData?.pago?.transaccionPago.cliente || {},
        usuario: pagoData?.pago?.transaccionPago.usuario || {},
      });
    }
  }, [pagoData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/pagos/editar/${id}`, { replace: true }); // Limpia el estado
    } else {
      refetch(); // Siempre refresca al cargar
    }
  }, [location.state, refetch, navigate, id]);

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Manejar la actualización del pago
  const handleUpdatePago = async (monto, referencia, id_transaccion) => {
    try {
      if (!monto || !referencia) {
        throw new Error("Todos los campos son obligatorios.");
      }
      const updated = { monto, referencia, id_transaccion };
      await updatePago({ id, updated }).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Pago actualizado exitosamente.",
          severity: "success",
        })
      );
      navigate("/pagos", { state: { refetch: true } }); // Redirigir a la lista de pagos
    } catch (error) {
      const errorMessage = error?.data?.error || error.message || "Desconocido";
      dispatch(
        showNotification({
          message: `Error al actualizar el pago: ${errorMessage}`,
          severity: "error",
        })
      );
    }
  };

  const generarRecibo = async () => {
    dispatch(
      showNotification({
        message: "Método no implementado",
        severity: "info",
      })
    );
  };

  const verHistorial = async () => {
    dispatch(
      showNotification({
        message: "Método no implementado",
        severity: "info",
      })
    );
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el pago.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el pago.</Typography>;
  }
  return (
    <Box m={3} pb={3}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/pagos")}
          sx={{
            height: "3rem",
            width: "250px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
        <FormControl
          fullWidth
          sx={{
            maxWidth: "250px",
            height: "3rem",
            "& .MuiInputBase-root": {
              height: "3rem", // Asegura que el Select tenga la misma altura que los botones
            },
          }}
        >
          <InputLabel id="action-select-label">Acción</InputLabel>
          <Select
            labelId="action-select-label"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <MenuItem value="actualizar">Actualizar Pago</MenuItem>
            <MenuItem value="generarRecibo">Generar Recibo</MenuItem>
            <MenuItem value="verHistorial">Ver Historial</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            switch (selectedAction) {
              case "actualizar":
                handleUpdatePago(
                  formData.monto,
                  formData.referencia,
                  formData.transaccionPago?.id_transaccion
                );
                break;
              case "generarRecibo":
                generarRecibo();
                break;
              case "verHistorial":
                verHistorial();
                break;
              default:
                console.log("Acción no definida");
            }
          }}
          disabled={
            !selectedAction || (selectedAction === "actualizar" && isUpdating) // Deshabilitar si se está actualizando
          }
          sx={{
            height: "3rem",
            width: "250px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {isUpdating && selectedAction === "actualizar"
            ? "Procesando..."
            : "Ejecutar Acción"}
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Editar Pago
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Información del Pago
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Id Pago",
                  value: formData.id_pago,
                  disabled: true,
                },
                {
                  label: "Monto",
                  value: formData.monto,
                  onChange: formData.monto === 0 ? null : handleInputChange,
                  name: "monto",
                  type: "number",
                  disabled: formData.monto === 0 ? true : false,
                },
                {
                  label: "Referencia",
                  value: formData.referencia,
                  onChange: handleInputChange,
                  name: "referencia",
                  type: "text",
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={5} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Estado",
                  value: formData.estado?.nombre || "Desconocido",
                  disabled: true,
                },
                {
                  label: "Método de Pago",
                  value: formData.metodo?.nombre || "Desconocido",
                  disabled: true,
                },
                {
                  type: "date",
                  label: "Fecha de Pago",
                  value: formData.fecha_pago
                    ? format(new Date(formData.fecha_pago), "yyyy-MM-dd", {
                        locale: es,
                      })
                    : "No especificada",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Información del Cliente */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mb={2}
          alignContent={"center"}
          pr={"0.4rem"}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Información del Cliente
          </Typography>
          <NavigationButton
            label="Ver Cliente"
            route={`/clientes/ver/${formData.cliente?.rut}`}
          />
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "RUT",
                  value: formData.cliente?.rut || "No especificado",
                  disabled: true,
                },
                {
                  label: "Cliente / Empresa",
                  value: formData.cliente?.tipo_cliente || "No especificado",
                  disabled: true,
                },
                {
                  label: "Razón Social",
                  value: formData.cliente?.razon_social || "No especificada",
                  disabled: true,
                  hidden: !formData.cliente?.razon_social,
                },
                {
                  label: "Nombre",
                  value: formData.cliente?.nombre || "No especificado",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Apellido",
                  value: formData.cliente?.apellido || "No especificado",
                  disabled: true,
                },
                {
                  label: "Dirección",
                  value: formData.cliente?.direccion || "No especificada",
                  disabled: true,
                },
                {
                  label: "Teléfono",
                  value: formData.cliente?.telefono || "No especificado",
                  disabled: true,
                },
                {
                  label: "Email",
                  value: formData.cliente?.email || "No especificado",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
        </Grid2>
      </Paper>
      {/* Información de la Transacción */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mb={2}
          alignContent={"center"}
          pr={"0.4rem"}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Información de la Transacción
          </Typography>
          <NavigationButton
            label={`Ver ${formData.transaccionPago.tipo_transaccion}`}
            route={`/${
              formData.transaccionPago.tipo_transaccion === "cotizacion"
                ? "cotizaciones"
                : `${formData.transaccionPago.tipo_transaccion}s`
            }/editar/${formData.transaccionPago?.id_transaccion}`}
          />
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Tipo de Transacción",
                  value:
                    formData.transaccionPago?.tipo_transaccion ||
                    "No especificada",
                  disabled: true,
                },
                {
                  label: "Total",
                  value: `$${formData.transaccionPago?.total || 0}`,
                  disabled: true,
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Observaciones",
                  value:
                    formData.transaccionPago?.observaciones ||
                    "No especificadas",
                  disabled: true,
                },
                {
                  label: "Fecha de Creación",
                  value: formData.transaccionPago?.fecha_creacion
                    ? format(
                        new Date(formData.transaccionPago?.fecha_creacion),
                        "yyyy-MM-dd",
                        {
                          locale: es,
                        }
                      )
                    : "No especificada",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Información del Usuario */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mb={2}
          alignContent={"center"}
          pr={"0.4rem"}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Información del Vendedor
          </Typography>
          <NavigationButton
            label="Ver Usuario"
            route={`/usuarios/editar/${formData.usuario?.rut}`}
          />
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Nombre",
                  value: formData.usuario?.nombre || "No especificado",
                  disabled: true,
                },
                {
                  label: "Apellido",
                  value: formData.usuario?.apellido || "No especificado",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "RUT",
                  value: formData.usuario?.rut || "No especificado",
                  disabled: true,
                },
                {
                  label: "Rol",
                  value: formData.usuario?.rol?.nombre || "No especificado",
                  disabled: true,
                },
              ]}
            />
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default EditarPago;
