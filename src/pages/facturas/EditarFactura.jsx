import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  CardContent,
  Grid2,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Table,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  useGetFacturaByIdQuery,
  useActualizarFacturaMutation,
} from "../../services/facturasApi";
import { useGetAllEstadosFacturaQuery } from "../../services/estadosFacturaApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../state/reducers/notificacionSlice";

const EditarFactura = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: factura, isLoading } = useGetFacturaByIdQuery(id);
  const { data: estadosFactura } = useGetAllEstadosFacturaQuery();
  const dispatch = useDispatch();

  const [actualizarFactura] = useActualizarFacturaMutation();

  const [formData, setFormData] = useState({
    numero_factura: "",
    total: "",
    id_estado_factura: "",
    tipo_factura: "",
    forma_pago: "",
  });

  useEffect(() => {
    if (factura) {
      setFormData({
        numero_factura: factura?.numero_factura || "",
        total: factura?.documento?.total || "",
        id_estado_factura: factura?.documento?.id_estado_pago || "",
        tipo_factura: factura?.tipo_factura || "",
        forma_pago: factura?.forma_pago || "",
      });
    }
  }, [factura]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { total, id_estado_factura, tipo_factura, forma_pago } = formData;
    const updatedFactura = {
      total,
      id_estado_factura,
      tipo_factura,
      forma_pago,
    };
    try {
      await actualizarFactura({ id, ...updatedFactura }).unwrap();
      dispatch(
        showNotification({
          message: "Se ha actualizado con éxtito",
          severity: "success",
        })
      );
      navigate("/facturas");
    } catch (error) {
      console.error("Error al actualizar factura:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "#f9fafc",
        maxWidth: "900px",
        margin: "2rem auto",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e3e6eb",
      }}
    >
      <Typography variant="h4" mb={3} align="center" color="primary">
        Editar Factura
      </Typography>
      {isLoading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Box mb={3}>
              <Typography variant="h4">Datos del Cliente</Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                RUT: {factura?.documento?.cliente?.rut || ""}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Razón Social: {factura?.documento?.cliente?.razon_social || ""}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Dirección: {factura?.documento?.cliente?.direccion || ""}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Teléfono: {factura?.documento?.cliente?.telefono || ""}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Email: {factura?.documento?.cliente?.email || ""}
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Factura"
                  name="numero_factura"
                  value={formData?.numero_factura}
                  onChange={handleChange}
                  margin="normal"
                  disabled
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total CLP ($)"
                  name="total"
                  type="number"
                  value={formData.total}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Factura"
                  name="tipo_factura"
                  value={formData.tipo_factura}
                  onChange={handleChange}
                  margin="normal"
                >
                  {["A", "B", "C"].map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Forma de Pago"
                  name="forma_pago"
                  value={formData.forma_pago}
                  onChange={handleChange}
                  margin="normal"
                >
                  {["Contado", "90 días", "60 días", "30 días"].map((forma) => (
                    <MenuItem key={forma} value={forma}>
                      {forma}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Estado de Factura"
                  name="id_estado_factura"
                  value={formData.id_estado_factura}
                  onChange={handleChange}
                  margin="normal"
                >
                  {estadosFactura?.map((estado) => (
                    <MenuItem
                      key={estado.id_estado_pago}
                      value={estado.id_estado_pago}
                    >
                      {estado.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
            </Grid2>

            <Box mt={4}>
              <Typography variant="h6" mb={2}>
                Detalles de la Transacción
              </Typography>
              <TableContainer
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Producto</TableCell>
                      <TableCell>Nombre Producto</TableCell>
                      <TableCell>Código de Barra</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unitario</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {factura?.documento?.transaccion?.detalles &&
                      factura?.documento?.transaccion?.detalles.map(
                        (detalle) => (
                          <TableRow key={detalle.id_detalle_transaccion}>
                            <TableCell>{detalle.id_producto}</TableCell>
                            <TableCell>
                              {detalle.producto?.nombre_producto}
                            </TableCell>
                            <TableCell>
                              {detalle.producto?.codigo_barra}
                            </TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            <TableCell>${detalle.precio_unitario}</TableCell>
                            <TableCell>${detalle.subtotal}</TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} textAlign="right">
                <Typography variant="h6" color="textPrimary">
                  Total CLP: ${factura?.documento?.transaccion?.total || 0}
                </Typography>
              </Box>
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="#e0e0e0"
                  onClick={() => navigate("/facturas")}
                >
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Guardar Cambios
                </Button>
              </Box>
            </Box>
          </CardContent>
        </form>
      )}
    </Box>
  );
};

export default EditarFactura;
