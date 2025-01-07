import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useGetAllEntregasQuery } from "../../services/entregasApi";
import { useNavigate } from "react-router-dom";

const EntregasCompletadas = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAllEntregasQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const choferesPerPage = 2; // Número de choferes por página

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography color="error">Error al cargar las entregas.</Typography>;
  }

  // Agrupar entregas por chofer y transacción
  const entregasPorChofer = data?.entregas.reduce((acc, chofer) => {
    const choferId = chofer.chofer.rut;

    if (!acc[choferId]) {
      acc[choferId] = {
        nombre: chofer.chofer.nombre,
        rut: chofer.chofer.rut,
        email: chofer.chofer.email,
        transacciones: [],
      };
    }

    chofer.transacciones.forEach((transaccion) => {
      acc[choferId].transacciones.push({
        id_transaccion: transaccion.id_transaccion,
        total: transaccion.total,
        cliente: transaccion.cliente,
        pagos: transaccion.pago,
        entregas: transaccion.entregas,
      });
    });

    return acc;
  }, {});

  const choferIds = Object.keys(entregasPorChofer);
  const totalPages = Math.ceil(choferIds.length / choferesPerPage);

  // Obtener los choferes de la página actual
  const currentChoferes = choferIds.slice(
    (currentPage - 1) * choferesPerPage,
    currentPage * choferesPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

  if (!data?.entregas || data.entregas.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            No hay entregas completadas
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Aún no se han registrado entregas completadas. Vuelve más tarde.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Entregas Completadas
      </Typography>
      {currentChoferes.map((choferId) => {
        const choferData = entregasPorChofer[choferId];
        return (
          <Box key={choferId} mb={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Chofer: {choferData.nombre} ({choferData.rut})
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Email: {choferData.email}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {choferData.transacciones.map((transaccion) => (
                <Box key={transaccion.id_transaccion} mb={2}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Venta ID: {transaccion.id_transaccion}
                    </Typography>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "#2e7d32" }}
                    >
                      Total de la Venta: ${transaccion?.total}
                    </Typography>
                    {transaccion.cliente && (
                      <>
                        <Typography variant="body2">
                          <strong>Cliente:</strong> {transaccion.cliente.nombre}{" "}
                          {transaccion.cliente.apellido}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Dirección:</strong>{" "}
                          {transaccion.cliente.direccion}
                        </Typography>
                        <Button
                              variant="outlined"
                              color="success"
                              onClick={() => navigate(`/ventas/editar/${transaccion.id_transaccion}`)}
                              sx={{ mt: 1, textTransform: "none" }}
                            >
                              Ver Venta
                            </Button>
                      </>
                    )}
                    {transaccion.pagos && transaccion.pagos.length > 0 && (
                      <>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}
                        >
                          Pagos Asociados:
                        </Typography>
                        {transaccion.pagos.map((pago) => (
                          <Box key={pago.id_pago} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>ID Pago:</strong> {pago.id_pago}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Monto:</strong> ${pago.monto}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Fecha:</strong>{" "}
                              {new Date(pago.fecha).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Referencia:</strong> {pago.referencia}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => navigate(`/pagos/editar/${pago.id_pago}`)}
                              sx={{ mt: 1, textTransform: "none" }}
                            >
                              Ver Pago
                            </Button>
                          </Box>
                        ))}
                      </>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {transaccion.entregas.map((entrega) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={entrega.id_entrega}
                        >
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              <strong>Entrega ID:</strong> {entrega.id_entrega}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Estado:</strong> {entrega.estadoEntrega}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Fecha y Hora:</strong>{" "}
                              {new Date(
                                entrega.fechaHoraEntrega
                              ).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Producto:</strong> {entrega.producto}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Cantidad:</strong> {entrega.cantidad}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Subtotal:</strong> ${entrega.subtotal}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              ))}
            </Paper>
          </Box>
        );
      })}
      {/* Controles de Paginación */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          Anterior
        </Button>
        <Typography variant="body1">
          Página {currentPage} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default EntregasCompletadas;
