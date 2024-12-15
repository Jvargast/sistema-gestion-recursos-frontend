import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  useGetFacturaByIdQuery,
  useActualizarFacturaMutation,
} from "../../services/facturasApi";
import { useGetAllEstadosFacturaQuery } from "../../services/estadosFacturaApi";

const EditarFactura = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: factura, isLoading } = useGetFacturaByIdQuery(id);
  const { data: estadosFactura, isLoading: isLoadingEstados } =
    useGetAllEstadosFacturaQuery();
  const [actualizarFactura] = useActualizarFacturaMutation();

  const [formData, setFormData] = useState({
    numero_factura: "",
    total: "",
    observaciones: "",
    id_estado_factura: "",
  });

  useEffect(() => {
    if (factura) {
      setFormData({
        numero_factura: factura.numero_factura || "",
        total: factura.total || "",
        observaciones: factura.observaciones || "",
        id_estado_factura: factura.id_estado_factura || "",
      });
    }
  }, [factura]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarFactura({ id, ...formData }).unwrap();
      navigate("/facturas");
    } catch (error) {
      console.error("Error al actualizar factura:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: theme.palette.background.default,
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "2rem auto",
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        Editar Factura
      </Typography>
      {isLoading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Número de Factura"
            name="numero_factura"
            value={formData.numero_factura}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Total ($)"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            select
            fullWidth
            label="Estado de Factura"
            name="id_estado_factura"
            value={formData.id_estado_factura}
            onChange={handleChange}
            margin="normal"
            error={!estadosFactura || estadosFactura.length === 0}
            helperText={
              !estadosFactura || estadosFactura.length === 0
                ? "No hay estados disponibles"
                : ""
            }
          >
            {estadosFactura &&
              estadosFactura.map((estado) => (
                <MenuItem
                  key={estado.id_estado_factura}
                  value={estado.id_estado_factura}
                >
                  {estado.nombre}
                </MenuItem>
              ))}
          </TextField>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/facturas")}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Guardar Cambios
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default EditarFactura;
