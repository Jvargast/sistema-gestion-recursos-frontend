import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useCreateClienteMutation } from "../../services/clientesApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";

const ModalCrearCliente = ({ open, onClose, onClienteCreado }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "persona",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    fecha_registro: new Date().toISOString(), // Fecha actual
    activo: true, // Por defecto activo
  });

  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const nuevoCliente = await createCliente(formData).unwrap(); // Llama al endpoint
      onClienteCreado(nuevoCliente); // Notifica al padre con el cliente creado
      dispatch(
        showNotification({
          message: "Se ha creado nuevo cliente",
          severity: "success",
        })
      );
      onClose(); // Cierra el modal
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear cliente` + error,
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Cliente</DialogTitle>
      <DialogContent>
      <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="RUT"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isCreating}>
        {isCreating ? "Creando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCrearCliente;
