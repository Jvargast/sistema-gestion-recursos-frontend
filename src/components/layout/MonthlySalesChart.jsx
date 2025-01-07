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
  // Asegurarse de que los datos estén presentes
  const datosMensuales = data?.datos_mensuales || [];

  // Transformar los datos mensuales para el gráfico
  const formattedData = datosMensuales.map((item) => ({
    mes: getMonthName(item.mes),
    total: parseFloat(item.total) || 0, // Asegurarse de que el total sea un número
    unidades: parseInt(item.unidades, 10) || 0, // Convertir unidades a número entero
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
        backgroundColor: theme.palette.background.default,
        borderRadius: "10px",
        p: "1rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginBottom: "1rem",
          color: "#000000",
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
          <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
          <XAxis
            dataKey="mes"
            stroke="#000000"
            tickMargin={10}
            tick={{ fill: "#000000" }}
          />
          <YAxis
            stroke="#000000"
            tick={{ fill: "#000000", fontSize: "1rem" }}
            domain={[0, "dataMax + 5000"]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#d82f2f",
              color: "#000000",
            }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
          <Legend style={{ fontSize: "1rem" }} />
          <Line
            type="linear"
            dataKey="total"
            stroke="#000000"
            strokeWidth={2}
            name="Ventas ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlySalesChart;
