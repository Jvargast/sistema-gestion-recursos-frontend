import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import {
  useGetAgendaByIdQuery,
  useUpdateAgendaMutation,
} from "../../services/agendaApi";
import BackButton from "../../components/common/BackButton";
import { formatDateForInput } from "../../utils/FormatDateInput";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { useDispatch } from "react-redux";

const AgendaDetail = () => {
  const { id } = useParams(); // Obtener el ID de la agenda desde la URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: agenda, isLoading, isError } = useGetAgendaByIdQuery(id);
  const [updateAgenda, { isLoading: isUpdating }] = useUpdateAgendaMutation();

  const [formData, setFormData] = useState({
    fechaHora: "",
    notas: "",
  });

  useEffect(() => {
    if (agenda) {
      setFormData({
        fechaHora: formatDateForInput(agenda.fechaHora),
        notas: agenda.notas || "",
      });
    }
  }, [agenda]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAgenda({ id, ...formData }).unwrap();
      dispatch(showNotification({
        message: "Agenda de carga se ha actualizado con éxito",
        severity: "success"
      }))
      navigate("/agendas");
    } catch (error) {
      alert("Error al actualizar la agenda.");
      console.error(error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error al cargar la agenda.</Typography>;

  return (
    <Box p={4}>
      <BackButton to="/agendas" label="Volver a la lista de agendas" />
      <Typography variant="h4" gutterBottom>
        Detalles de la Agenda
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Typography variant="h6">Información del Camión</Typography>
          <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
            <Typography>
              <strong>Placa:</strong> {agenda.camion.placa}
            </Typography>
            <Typography>
              <strong>Capacidad:</strong> {agenda.camion.capacidad}
            </Typography>
            <Typography>
              <strong>Estado:</strong> {agenda.camion.estado}
            </Typography>
          </Paper>
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Información del Chofer</Typography>
          <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
            <Typography>
              <strong>Nombre:</strong> {agenda.chofer.nombre}{" "}
              {agenda.chofer.apellido}
            </Typography>
            <Typography>
              <strong>RUT:</strong> {agenda.chofer.rut}
            </Typography>
            <Typography>
              <strong>Email:</strong> {agenda.chofer.email}
            </Typography>
          </Paper>
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Inventario</Typography>
          <Divider />
          <Typography variant="subtitle1" mt={2}>
            <strong>Disponible:</strong>
          </Typography>
          {agenda.inventario.disponible.map((item, idx) => (
            <Typography key={idx}>
              {item.nombre} - {item.cantidad} unidades
            </Typography>
          ))}
          <Typography variant="subtitle1" mt={2}>
            <strong>Reservado:</strong>
          </Typography>
          {agenda.inventario.reservado.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                mt: 1,
                p: 1,
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <Typography>
                <strong>Producto:</strong> {item.nombre}
              </Typography>
              <Typography>
                <strong>Cantidad:</strong> {item.cantidad}
              </Typography>
              {item.cliente && (
                <Typography>
                  <strong>Cliente:</strong> {item.cliente.nombre || ""}{" "}
                  {item.cliente.apellido || ""}
                </Typography>
              )}
              <Typography>
                <strong>Dirección:</strong>{" "}
                {item?.cliente?.direccion ? item?.cliente?.direccion : ""}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box mb={2}>
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Notas"
            name="notas"
            value={formData.notas}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUpdating}
        >
          {isUpdating ? "Actualizando..." : "Actualizar Agenda"}
        </Button>
      </form>
    </Box>
  );
};

export default AgendaDetail;
