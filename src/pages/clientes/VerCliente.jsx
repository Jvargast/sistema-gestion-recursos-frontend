import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid2,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { useGetClienteByIdQuery } from "../../services/clientesApi";
import { useDispatch } from "react-redux";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../state/reducers/notificacionSlice";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";

const VerCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: clienteData,
    isLoading,
    isError,
    refetch,
  } = useGetClienteByIdQuery(id);

  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    fecha_registro: null,
    activo: null,
  });

  useEffect(() => {
    if (clienteData) {
      setFormData({
        rut: clienteData?.rut || "",
        tipo_cliente: clienteData.tipo_cliente || "",
        razon_social: clienteData?.razon_social || "",
        nombre: clienteData?.nombre || "",
        apellido: clienteData?.apellido || "",
        direccion: clienteData?.direccion || "",
        telefono: clienteData?.telefono || "",
        email: clienteData?.email || "",
        fecha_registro: clienteData?.fecha_registro || null,
        activo: clienteData?.activo,
      });
    }
  }, [clienteData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/ver/${id}`, { replace: true }); // Limpia el estado
    } else {
      refetch(); // Siempre refresca al cargar
    }
  }, [location.state, refetch, navigate, id]);

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
    <Box m={3}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/clientes")}
          sx={{
            height: "3rem",
            width: "250px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/clientes/editar/${formData.rut}`)}
          sx={{
            height: "3rem",
            width: "250px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Editar Cliente
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Ver Cliente
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Información del Cliente
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "RUT",
                  value: formData.rut || "No especificado",
                  disabled: true,
                },
                {
                  label: "Nombre",
                  value: formData.nombre || "No especificado",
                  disabled: true,
                },
                {
                  label: "Email",
                  value: formData.email || "No especificado",
                  disabled: true,
                },
                {
                  /* label: "Estado", */
                  value: formData.activo,
                  render: (value) => (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Estado:
                      </Typography>
                      <Chip
                        label={value ? "Activo" : "Inactivo"}
                        sx={{
                          backgroundColor: value ? "green" : "red",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      />
                    </Box>
                  ),
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Teléfono",
                  value: formData.telefono || "No especificado",
                  disabled: true,
                },
                {
                  label: "Dirección",
                  value: formData.direccion || "No especificada",
                  disabled: true,
                },
                {
                  label: "Tipo",
                  value: formData.tipo_cliente || "No especificado",
                  disabled: true,
                },
                {
                  label: "Fecha de Creación",
                  value: formData.fecha_registro
                    ? format(new Date(formData.fecha_registro), "dd-MM-yyyy", {
                        locale: es,
                      })
                    : "No especificado",
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

export default VerCliente;
