import React, { useState } from "react";
import FlexBetween from "../../components/layout/FlexBetween";
import Header from "../../components/common/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import BreakdownChart from "../../components/layout/BreakDownChart";
import MonthlySalesChart from "../../components/layout/MonthlySalesChart";
import { useObtenerPorAnoQuery } from "../../services/analisisApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import StatBox from "../../components/layout/StatBox";
import { useGetPorcentajeClientesNuevosQuery } from "../../services/clientesApi";
import { useGetPorcentajesYCantidadVentasNuevasAnoQuery, useGetPorcentajesYCantidadVentasNuevasMesQuery, useGetPorcentajesYCantidadVentasNuevasQuery } from "../../services/ventasApi";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: estadisticas, isLoading } = useObtenerPorAnoQuery(selectedYear);

  const handleDownloadReport = () => {
    alert("Descarga de reportes no implementada aún.");
  };

  return (
    <Box m="2rem 3rem">
      {/* Header */}
      <FlexBetween>
        <Header title="Dashboard" subtitle="Bienvenido al dashboard" />

        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleDownloadReport}
        >
          <DownloadOutlined sx={{ mr: "10px" }} />
          Descargar Reportes
        </Button>
      </FlexBetween>

      {/* Ventas Anuales */}
      <Box
        mt="30px"
        p="1.5rem"
        backgroundColor={theme.palette.background.paper}
        borderRadius="12px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
      >
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <MonthlySalesChart data={estadisticas ? estadisticas : []} />
        )}
      </Box>

      {/* Estadísticas */}
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="auto"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <Box
          gridColumn="span 6"
          backgroundColor={theme.palette.background.default}
          borderRadius="12px"
          p="20px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gridTemplateRows="repeat(2, 1fr)"
            gap="20px"
          >
            {/* Estadísticas individuales */}
            <StatBox
               title="Clientes Nuevos"
               description="Desde el mes pasado"
               icon={<Email sx={{ color: "#4DD0E1", fontSize: "26px" }} />}
               useQueryHook={useGetPorcentajeClientesNuevosQuery} // Hook dinámico
            />
           <StatBox
              title="Ventas del día"
              description="Desde ayer"
              icon={
                <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />
              }
              useQueryHook={useGetPorcentajesYCantidadVentasNuevasQuery} // Pasar el hook como prop
            />
            <StatBox
              title="Ventas del Mes"
              description="Desde el mes pasado"
              icon={
                <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />
              }
              useQueryHook={useGetPorcentajesYCantidadVentasNuevasMesQuery} 
            />
             <StatBox
              title="Ventas Anuales"
              description="Desde el año pasado"
              icon={
                <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />
              }
              useQueryHook={useGetPorcentajesYCantidadVentasNuevasAnoQuery} 
            />
            {/* <StatBox
              title="Ventas Anuales"
              value={40}
              increase="+43%"
              description="Desde el año pasado"
              icon={
                <Traffic
                  sx={{ color: theme.palette.secondary.main, fontSize: "26px" }}
                />
              }
            /> */}
          </Box>
        </Box>

        {/* Ventas por Producto */}
        <Box
          gridColumn="span 6"
          backgroundColor={theme.palette.background.paper}
          borderRadius="12px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
          p="2rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            maxHeight: "600px", // Controla la altura máxima
            minHeight: "500px", // Controla la altura mínima para consistencia visual
            overflow: "hidden", // Evita que los elementos sobresalgan
          }}
        >
          <BreakdownChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
