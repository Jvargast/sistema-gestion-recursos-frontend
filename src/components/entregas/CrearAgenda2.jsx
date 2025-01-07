import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DetallesSelector from "./DetallesSelector";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
//import { useGetAllChoferesQuery } from "../../services/usuariosApi";
import { useGetAllCamionesQuery } from "../../services/camionesApi";
import { useSelector } from "react-redux";

const CrearAgenda2 = ({
  onSubmit,
  detallesSeleccionados,
  setDetallesSeleccionados,
  isCreating,
}) => {
  const [fechaHora, setFechaHora] = useState("");
  /* const [selectedChofer, setSelectedChofer] = useState(""); */ // Para manejar el chofer seleccionado

  const [selectedCamion, setSelectedCamion] = useState("");
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  console.log(user);

/*   const { data: choferesData, isLoading: isLoadingChoferes } =
    useGetAllChoferesQuery(); */

  const { data: camionesData, isLoading: isLoadingCamiones } =
    useGetAllCamionesQuery();

  const handleDetallesSeleccionados = (nuevosDetalles) => {
    setDetallesSeleccionados((prev) => {
      const idsExistentes = new Set(prev.map((d) => d.id_detalle_transaccion));
      const detallesUnicos = nuevosDetalles.filter(
        (d) => !idsExistentes.has(d.id_detalle_transaccion)
      );
      return [...prev, ...detallesUnicos];
    });
  };

  const handleRemoveDetalle = (detalleId) => {
    setDetallesSeleccionados((prev) =>
      prev.filter((detalle) => detalle.id_detalle_transaccion !== detalleId)
    );
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const agendaData = {
      fecha_hora: fechaHora,
      rut: user?.id,
      id_camion: selectedCamion,
      /*       detalles: detallesSeleccionados.map((d) => d.id_detalle_transaccion),
      productos_adicionales: productosAdicionales, */
    };

    onSubmit(agendaData);
  };

  // Agrupar detalles seleccionados por cliente
  const detallesAgrupadosPorCliente = detallesSeleccionados.reduce(
    (acc, detalle) => {
      const cliente = detalle.transaccion.cliente.nombre; // Accede al cliente desde la transacción asociada
      if (!acc[cliente]) acc[cliente] = [];
      acc[cliente].push(detalle);
      return acc;
    },
    {}
  );

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "600px", // Ajusta el ancho máximo del modal
        margin: "auto",
        boxShadow: 3,
        borderRadius: "10px", // Opcional: bordes redondeados
        overflow: "hidden", // Evita que el contenido desborde
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Crear Agenda de Carga
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          label="Fecha y Hora"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={fechaHora}
          onChange={(e) => setFechaHora(e.target.value)}
          sx={{ mb: 3 }}
          required
        />
        {/* Mostrar Chofer Autenticado */}
        <Typography variant="h4" gutterBottom>
          Chofer Asignado:
        </Typography>
        <Chip
          label={`Nombre: ${user?.nombre} - Rut: ${user?.id}`}
          color="primary"
          sx={{ mb: 3, fontSize: "1rem" }}
        />
        {/* Selector de Chofer */}
        {/* <FormControl fullWidth sx={{ mb: 3 }} required>
          <InputLabel>Seleccionar Chofer</InputLabel>
          <Select
            value={selectedChofer}
            onChange={(e) => setSelectedChofer(e.target.value)}
            disabled={isLoadingChoferes} // Deshabilitar mientras se cargan los choferes
          >
            {isLoadingChoferes ? (
              <MenuItem disabled>Cargando choferes...</MenuItem>
            ) : (
              choferesData?.map((chofer) => (
                <MenuItem key={chofer.rut} value={chofer.rut}>
                  {`Nombre: ${chofer.nombre} - Rut: ${chofer.rut}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl> */}
        {/* Selector de Camión */}
        <FormControl fullWidth sx={{ mb: 3 }} required>
          <InputLabel>Seleccionar Camión</InputLabel>
          <Select
            value={selectedCamion}
            onChange={(e) => setSelectedCamion(e.target.value)}
            disabled={isLoadingCamiones} // Deshabilitar mientras se cargan los camiones
          >
            {isLoadingCamiones ? (
              <MenuItem disabled>Cargando camiones...</MenuItem>
            ) : (
              camionesData?.map((camion) => (
                <MenuItem key={camion.id_camion} value={camion.id_camion}>
                  {`ID: ${camion.id_camion} - Patente: ${camion.placa} - Carga: ${camion.capacidad}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setIsDetallesModalOpen(true)}
          sx={{ mb: 3 }}
        >
          Seleccionar Detalles
        </Button>
        {Object.keys(detallesAgrupadosPorCliente).length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Detalles Seleccionados:
            </Typography>
            <Box
              sx={{
                maxHeight: "300px", // Limita la altura máxima
                overflowY: "auto", // Habilita el scroll vertical
                border: "1px solid #ccc", // Opcional: Añade un borde para diferenciar la sección
                borderRadius: "8px", // Opcional: Bordes redondeados
                p: 2, // Añade padding interno
                backgroundColor: "#f9f9f9", // Opcional: Fondo claro para destacar la sección
              }}
            >
              {Object.entries(detallesAgrupadosPorCliente).map(
                ([cliente, detalles]) => (
                  <Box key={cliente} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Cliente: {cliente}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    {detalles.map((detalle) => (
                      <Chip
                        key={detalle.id_detalle_transaccion}
                        label={`${detalle.producto.nombre_producto} - Cantidad: ${detalle.cantidad}`}
                        sx={{ mr: 1, mb: 1 }}
                        onDelete={() =>
                          handleRemoveDetalle(detalle.id_detalle_transaccion)
                        }
                        deleteIcon={
                          <IconButton
                            onClick={() =>
                              handleRemoveDetalle(
                                detalle.id_detalle_transaccion
                              )
                            }
                          >
                            <ClearOutlinedIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </Box>
                )
              )}
            </Box>
          </Box>
        )}

        <Box mt={4} textAlign="center">
          <Button type="submit" variant="contained" color="primary">
            {isCreating ? "Creando Agenda..." : "Crear Agenda"}
          </Button>
          {isCreating && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </form>

      {isDetallesModalOpen && (
        <DetallesSelector
          open={isDetallesModalOpen}
          onClose={() => setIsDetallesModalOpen(false)}
          onSeleccionar={handleDetallesSeleccionados}
        />
      )}
    </Box>
  );
};

export default CrearAgenda2;
