import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Typography, CardContent, Card, Grid2 } from "@mui/material";
import {
  HomeOutlined,
  PointOfSaleOutlined,
  PeopleAltOutlined,
  PieChartOutlined,
  TrendingUpOutlined,
  AssignmentIndOutlined,
  SecurityOutlined,
  SupervisorAccountOutlined,
} from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined className="text-blue-500" />,
    description: "Administra el estado general",
    path: "/dashboard",
  },
  {
    text: "Ventas",
    icon: <PointOfSaleOutlined className="text-teal-500" />,
    description: "Gestión de facturas, pagos, cotizaciones, pedidos y clientes",
    path: "/ventas",
  },
  {
    text: "Almacén",
    icon: <Inventory2OutlinedIcon className="text-pink-500" />,
    description: "Gestión de productos e insumos",
    path: "/productos",
  },
  {
    text: "Proveedores y Mensajes",
    icon: <PeopleAltOutlined className="text-cyan-500" />,
    description: "Gestión de proveedores y comunicación interna",
    path: "/proveedores-mensajes",
  },
  {
    text: "Análisis",
    icon: <PieChartOutlined className="text-sky-500" />,
    description: "Reporte diario, mensual y desglose de datos",
    path: "/analisis",
  },
  {
    text: "Seguridad",
    icon: <SecurityOutlined className="text-red-500" />,
    description: "Gestión de seguridad del sistema",
    path: "/seguridad",
  },
  {
    text: "Rendimiento",
    icon: <TrendingUpOutlined className="text-emerald-500" />,
    description: "Análisis de rendimiento",
    path: "/rendimiento",
  },
  {
    text: "Usuarios",
    icon: <SupervisorAccountOutlined className="text-purple-500" />,
    description: "Administración de usuarios",
    path: "/usuarios",
  },
  {
    text: "Roles",
    icon: <AssignmentIndOutlined className="text-yellow-500" />,
    description: "Gestión de roles y Permisos",
    path: "/roles",
  },
  {
    text: "Empresa",
    icon: <BusinessIcon className="text-zinc-500" />,
    description: "Gestión de empresa y sucursales",
    path: "/empresa",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        backgroundColor: "gray.50",
        p:1
      }}
    >
      <Grid2 container spacing={2} justifyContent="center" wrap="wrap">
        {navItems.map((item, index) => (
          <Grid2
            key={index}
            xs={12}
            sm={6}
            md={4}
            lg={2.4}
            className="flex justify-center"
          >
            <Card
              variant="outlined"
              className="w-[12rem] h-[12rem] flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer bg-white"
              onClick={() => navigate(item.path)}
            >
              <Box className="text-5xl mb-2 hover:text-gray-700">
                {item.icon}
              </Box>
              <CardContent className="text-center">
                <Typography
                  variant="h6"
                  component="div"
                  className="font-bold text-gray-800"
                >
                  {item.text}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Index;
