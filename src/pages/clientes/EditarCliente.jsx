import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Grid2, Button, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";
import LoaderComponent from "../../components/common/LoaderComponent";
import {
  useGetClienteByIdQuery,
  useUpdateClienteMutation,
} from "../../services/clientesApi";

const EditarCliente = () => {
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
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation();

  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "+56 ",
    email: "",
    activo: true,
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
        activo: clienteData?.activo,
      });
    }
  }, [clienteData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/editar/${id}`, { replace: true }); // Limpia el estado
    } else {
      refetch(); // Siempre refresca al cargar
    }
  }, [location.state, refetch, navigate, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Datos enviados:", formData); // Verifica los datos enviados
      await updateCliente({ id, formData }).unwrap();
      dispatch(
        showNotification({
          message: "Cliente actualizado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes"/* , { state: { refetch: true } } */);
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar el cliente: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el cliente.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el cliente.</Typography>;
  }

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Editar Cliente
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
                  disabled: true,
                },
                {
                  label: "Nombre",
                  name: "nombre",
                  value: formData.nombre,
                  onChange: handleInputChange,
                },
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
                  value: formData.activo ?? true,
                  onChange: handleInputChange,
                  options: [
                    { value: true, label: "Activo" },
                    { value: false, label: "Inactivo" },
                  ],
                },
              ]}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} width={"49%"}>
            <InfoFieldGroup
              fields={[
                {
                  label: "Teléfono",
                  name: "telefono",
                  value: formData.telefono,
                  onChange: handleInputChange,
                },
                {
                  label: "Dirección",
                  name: "direccion",
                  value: formData.direccion,
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
            disabled={isUpdating}
            sx={{
              height: "3rem",
              width: "250px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarCliente;
