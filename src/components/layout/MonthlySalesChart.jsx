import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

const MonthlySalesChart = ({ data }) => {
  const theme = useTheme();

  // Transformar los datos mensuales para el gráfico
  const formattedData = data[0]?.datos_mensuales.map((item) => ({
    mes: getMonthName(item.mes),
    total: item.total, // Asegurarse de que el total sea un número
    unidades: parseInt(item.unidades, 10), // Convertir unidades a número entero
  }));

  // Función para obtener el nombre del mes
  function getMonthName(monthNumber) {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[monthNumber - 1];
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.charts,
        borderRadius: "10px",
        p: "1rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginBottom: "1rem",
          color: theme.palette.grey[900],
          fontSize: "3rem",
        }}
      >
        Ventas Anuales
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 60, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            stroke={theme.palette.primary[100]}
            tickMargin={10}
          />
          <YAxis
            stroke={theme.palette.primary.charts}
            domain={[0, "dataMax + 5000"]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            tickLine={false}
            tick={{ fontSize: "1rem", fill: theme.palette.grey[900] }}
          />
          <Tooltip
            contentStyle={{ color: theme.palette.primary.charts }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
          <Legend style={{ fontSize: "1rem" }} />
          <Line
            type="linear"
            dataKey="total"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            name="Ventas ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlySalesChart;
