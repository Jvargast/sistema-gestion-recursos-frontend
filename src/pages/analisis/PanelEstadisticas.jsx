import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

import { showNotification } from "../../state/reducers/notificacionSlice";
import {
  useCalcularEstadisticasPorAnoMutation,
  useObtenerPorAnoQuery,
  useObtenerPorMesQuery,
} from "../../services/analisisApi";
import {
  useCalcularEstadisticasAnoMutation,
  useObtenerPorProductoYAnoQuery,
} from "../../services/analisisProductosApi";

const PanelEstadisticas = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(1);
  const [selectedView, setSelectedView] = useState("year");

  // RTK Queries y Mutations
  const { data: yearStats, isLoading: loadingYearStats } =
    useObtenerPorAnoQuery(year);
  const { data: monthStats, isLoading: loadingMonthStats } =
    useObtenerPorMesQuery({ year, month });
  const { data: productStats, isLoading: loadingProductStats } =
    useObtenerPorProductoYAnoQuery({ id_producto: 1, year });

  const [calcularEstadisticasPorAno, { isLoading: creatingStats }] =
    useCalcularEstadisticasPorAnoMutation();
  const [calcularProductoEstadisticas, { isLoading: creatingProductStats }] =
    useCalcularEstadisticasAnoMutation();

  // Manejar creación de estadísticas
  const handleCrearEstadisticas = async () => {
    try {
      await calcularEstadisticasPorAno(year).unwrap();
      dispatch(
        showNotification({
          message: "Estadísticas creadas con éxito.",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear estadísticas: ${error.message}`,
          severity: "error",
        })
      );
    }
  };

  const handleCrearProductoEstadisticas = async () => {
    try {
      await calcularProductoEstadisticas(year).unwrap();
      dispatch(
        showNotification({
          message: "Estadísticas de productos creadas con éxito.",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear estadísticas de productos: ${error.message}`,
          severity: "error",
        })
      );
    }
  };

  // Renderizado condicional según la vista seleccionada
  const renderSelectedView = () => {
    if (selectedView === "year") {
      if (loadingYearStats) return <CircularProgress />;
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h5" gutterBottom>
            Estadísticas por Año: {year}
          </Typography>
          <Paper
            elevation={4}
            sx={{ p: 4, borderRadius: "16px", backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">
              Ventas Anuales: {yearStats?.ventas_anuales || "-"}
            </Typography>
            <Typography variant="h6">
              Unidades Vendidas: {yearStats?.unidades_vendidas_anuales || "-"}
            </Typography>
          </Paper>
        </motion.div>
      );
    }

    if (selectedView === "month") {
      if (loadingMonthStats) return <CircularProgress />;
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h5" gutterBottom>
            Estadísticas por Mes: {month}/{year}
          </Typography>
          <Paper
            elevation={4}
            sx={{ p: 4, borderRadius: "16px", backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">
              Total del Mes: {monthStats?.total || "-"}
            </Typography>
            <Typography variant="h6">
              Unidades Vendidas: {monthStats?.unidades || "-"}
            </Typography>
          </Paper>
        </motion.div>
      );
    }

    if (selectedView === "products") {
      if (loadingProductStats) return <CircularProgress />;
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h5" gutterBottom>
            Estadísticas de Productos: Año {year}
          </Typography>
          <Paper
            elevation={4}
            sx={{ p: 4, borderRadius: "16px", backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">
              Ventas: {productStats?.ventas || "-"}
            </Typography>
            <Typography variant="h6">
              Unidades Vendidas: {productStats?.unidades || "-"}
            </Typography>
          </Paper>
        </motion.div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Panel de Estadísticas
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant={selectedView === "year" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedView("year")}
          >
            Por Año
          </Button>
          <Button
            variant={selectedView === "month" ? "contained" : "outlined"}
            color="error"
            onClick={() => setSelectedView("month")}
          >
            Por Mes
          </Button>
          <Button
            variant={selectedView === "products" ? "contained" : "outlined"}
            color="info"
            onClick={() => setSelectedView("products")}
          >
            Por Producto
          </Button>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Box sx={{ mb: 4 }}>
          {selectedView === "year" && (
            <TextField
              label="Año"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          {selectedView === "month" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Año"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
              />
              <TextField
                label="Mes"
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                fullWidth
              />
            </Box>
          )}
        </Box>
        {renderSelectedView()}
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCrearEstadisticas}
            disabled={creatingStats}
          >
            {creatingStats ? "Creando..." : "Crear Estadísticas"}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleCrearProductoEstadisticas}
            disabled={creatingProductStats}
          >
            {creatingProductStats
              ? "Creando..."
              : "Crear Estadísticas de Productos"}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default PanelEstadisticas;
