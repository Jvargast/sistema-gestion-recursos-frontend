import React, { useEffect, useState } from "react";
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
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "../../components/layout/BreakDownChart";
/* import OverviewChart from "../../components/layout/OverviewChart"; */
/*import { useGetDashboardQuery } from "state/api";*/
import StatBox from "../../components/layout/StatBox";
/* import { useGetAllClientesQuery } from "../../services/clientesApi"; */
import MonthlySalesChart from "../../components/layout/MonthlySalesChart";
import { useObtenerPorAnoQuery } from "../../services/analisisApi";
import LoaderComponent from "../../components/common/LoaderComponent";


const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: estadisticas, isLoading } = useObtenerPorAnoQuery(2024);
  const [loading, setLoading] = useState(false);


  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Bienvenido al dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.primary[400],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Descargar Reportes
          </Button>
        </Box>
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="10px"
      >
        {/* Gráfico de Ventas Anuales */}
        <Box gridColumn="span 12">
          {isLoading  ? (
            <LoaderComponent/>
          ) : (
            <MonthlySalesChart data={estadisticas ? estadisticas:[]} />
          )}
        </Box>
      </Box>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Clientes"
          value={40}
          increase="+14%"
          description="Desde el mes pasado"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[100], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Ventas del día"
          value={"100"}
          increase={`${null}`?  "+21%" : `${null}`}
          description="Desde ayer"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[100], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.charts}
          p="1rem"
          borderRadius="0.55rem"
        >
          {"hola"}
        {/* <OverviewChart view="sales" isDashboard={true} /> */}
        </Box>
        <StatBox
          title="Ventas Mensuales"
          value={"30"}
          increase="+5%"
          description="Desde el mes pasado"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[100], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Ventas Anuales"
          value={"40"}
          increase="+43%"
          description="Desde el año pasado"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[100], fontSize: "26px" }}
            />
          }
        />
  
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.primary[500]}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Ventas por categoría
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
