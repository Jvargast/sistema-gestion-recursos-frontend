import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { PieChart } from "@mui/x-charts/PieChart";
import { useGetAllEstadisticasQuery } from "../../services/analisisProductosApi";

/* import { useTheme } from "@mui/material"; */

const BreakdownChart = () => {
  const { data, isLoading } = useGetAllEstadisticasQuery({
    page: 1,
    limit: 10,
  });
  /* const theme = useTheme(); */

  const [radius, setRadius] = useState(50);
  const [itemNb, setItemNb] = useState(10);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const colors = [
    "#E57373",
    "#81C784",
    "#64B5F6",
    "#FFD54F",
    "#4DD0E1",
    "#BA68C8",
    "#FF8A65",
    "#A1887F",
    "#90A4AE",
    "#DCE775",
  ];

  if (isLoading) return "Cargando...";

  // Transformar datos del endpoint al formato requerido por PieChart
  const formattedData =
    data?.data?.map((item, index) => ({
      label: item.nombre_producto || "Desconocido",
      value: parseFloat(item.ventas_anuales) || 0,
      color: colors[index % colors.length],
      unidades: item.unidades_vendidas_anuales,
    })) || [];

  const visibleData = formattedData.slice(0, itemNb);

  const valueFormatter = (item) =>
    `$${item.value.toLocaleString()} (${(
      (item.value / formattedData.reduce((sum, i) => sum + i.value, 0)) *
      100
    ).toFixed(2)}%)`;

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue === "number") setItemNb(newValue);
  };

  const handleRadiusChange = (event, newValue) => {
    if (typeof newValue === "number") setRadius(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Ventas por Productos
      </Typography>

      <PieChart
        height={400}
        series={[
          {
            data: visibleData.map((item) => ({
              ...item,
              valueFormatter,
            })),
            innerRadius: radius,
            arcLabel: (params) => `${params.label}`,
            arcLabelMinAngle: 20,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            valueFormatter,
          },
        ]}
        colors={(d, i) => d.color || colors[i % colors.length]}
        skipAnimation={skipAnimation}
        sx={{
          "& .MuiChartsLegend-root": {
            display: "none !important",
          },
          fontSize: "1.2rem",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {visibleData.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "0 10px",
            }}
          >
            <Box
              sx={{
                width: "16px",
                height: "16px",
                backgroundColor: item.color,
                marginRight: "8px",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ marginTop: "1rem" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={skipAnimation}
              onChange={(e) => setSkipAnimation(e.target.checked)}
            />
          }
          label="Omitir animación"
        />
      </Box>
      <Box sx={{ marginTop: "1rem" }}>
        <Typography id="item-slider" gutterBottom>
          Cantidad de elementos mostrados
        </Typography>
        <Slider
          value={itemNb}
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          min={1}
          max={formattedData.length}
          aria-labelledby="item-slider"
          sx={{ marginBottom: "1rem", color: "#4DD0E1" }}
        />
        <Typography id="radius-slider" gutterBottom>
          Radio
        </Typography>
        <Slider
          value={radius}
          onChange={handleRadiusChange}
          valueLabelDisplay="auto"
          min={15}
          max={100}
          aria-labelledby="radius-slider"
          sx={{ color: "#4DD0E1" }}
        />
      </Box>
    </Box>
  );
};

export default BreakdownChart;
