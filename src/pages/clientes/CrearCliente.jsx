import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid2,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { useCreateClienteMutation } from "../../services/clientesApi";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import LoaderComponent from "../../components/common/LoaderComponent";

const libraries = ["places"];

const CrearCliente = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();

  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    fecha_registro: new Date().toISOString(), // Asigna la fecha actual por defecto
    activo: true, // Por defecto activo
  });
  const autocompleteRef = useRef(null);

  // Cargar el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfC5j5PNCgk1cua_T-0BUE44bk74Fg7Yc", // Sustituye con tu clave de API de Google Maps
    libraries,
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        direccion: place.formatted_address,
      }));
    }
  };
  // Formatear el RUT
  const formatRut = (value) => {
    if (!value) return "";
    // Eliminar puntos, guiones y espacios
    const cleaned = value.replace(/[^\dkK]/g, "");

    // Dividir en cuerpo y dígito verificador
    const cuerpo = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();

    // Agregar puntos al cuerpo
    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Concatenar cuerpo y dígito verificador
    return `${formattedCuerpo}-${dv}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "telefono") {
      // Forzar que siempre inicie con "+56 "
      if (!value.startsWith("+56")) {
        formattedValue = `+56 ${value.replace(/[^\d]/g, "")}`;
      } else {
        // Eliminar caracteres no válidos y aplicar formato
        const cleaned = value.replace(/[^\d]/g, "").substring(2); // Elimina el "+56"
        formattedValue = `+56 ${cleaned.replace(
          /^(\d{1})(\d{4})(\d{4})$/,
          "$1 $2 $3"
        )}`;
      }
    }
    if (name === "rut") {
      formattedValue = formatRut(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createCliente(formData).unwrap();
      dispatch(
        showNotification({
          message: "Cliente creado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear el cliente: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };
  if (loadError) {
    return (
      <Typography color="error">Error al cargar Google Maps API</Typography>
    );
  }

  if (!isLoaded) {
    return <LoaderComponent />;
  }

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Crear Cliente
      </Typography>
      <Divider sx={{ my: 2 }} />
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
                  name: "rut",
                  value: formData.rut,
                  onChange: handleInputChange,
                },
                {
                  label: "Tipo de Cliente",
                  name: "tipo_cliente",
                  type: "select",
                  value: formData.tipo_cliente,
                  onChange: handleInputChange,
                  options: [
                    { value: "persona", label: "Persona" },
                    { value: "empresa", label: "Empresa" },
                  ],
                },
                ...(formData.tipo_cliente === "empresa"
                  ? [
                      {
                        label: "Razón Social",
                        name: "razon_social",
                        value: formData.razon_social,
                        onChange: handleInputChange,
                      },
                    ]
                  : []),
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Nombre",
                  name: "nombre",
                  value: formData.nombre,
                  onChange: handleInputChange,
                },
                {
                  label: "Apellido",
                  name: "apellido",
                  value: formData.apellido,
                  onChange: handleInputChange,
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <Box mb={2}>
              {/* <Typography variant="body1" fontWeight="bold">
                Dirección
              </Typography> */}
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceSelect}
              >
                <TextField
                  fullWidth
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ingrese la dirección"
                />
              </Autocomplete>
            </Box>
            <InfoFieldGroup
              fields={[
                {
                  label: "Teléfono",
                  name: "telefono",
                  value: formData.telefono,
                  onChange: handleInputChange,
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  value: formData.email,
                  onChange: handleInputChange,
                },
                {
                  label: "Estado",
                  name: "activo",
                  type: "select",
                  value: formData.activo,
                  onChange: handleInputChange,
                  options: [
                    { value: true, label: "Activo" },
                    { value: false, label: "Inactivo" },
                  ],
                },
              ]}
            />
          </Grid2>
        </Grid2>
        <Box display="flex" justifyContent="space-between" mt={3}>
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
            onClick={handleSubmit}
            disabled={isCreating}
            sx={{
              height: "3rem",
              width: "250px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {isCreating ? "Creando..." : "Crear Cliente"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CrearCliente;
