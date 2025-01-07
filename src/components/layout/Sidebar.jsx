import {
  BottomNavigationAction,
  BottomNavigation,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
/*   PublicOutlined, */
  PointOfSaleOutlined,
/*   TodayOutlined,
  CalendarMonthOutlined, */
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  WarehouseOutlined,
/*   PeopleAltOutlined,
  ChatOutlined, */
  PersonOutline,
  CategoryOutlined,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import logoImage from "../../assets/images/logo_aguas_valentino2.png";
import { useSelector } from "react-redux";

export const modulesData = [
  {
    // Este primer objeto puede ser un ítem "sueltito"
    name: "Dashboard",
    icon: <HomeOutlined />,
    path: "dashboard",
    permission: "ver_dashboard",
    children: null, // sin hijos
  },
  {
    name: "Modulo Ventas",
    icon: null, // en caso de que quieras un ícono genérico, ponlo aquí
    permission: "ver_ventas",
    children: [
      {
        text: "Facturas",
        icon: <ReceiptLongOutlined />,
        path: "facturas",
        permission: "ver_facturas",
      },
      {
        text: "Pagos",
        icon: <PaymentOutlinedIcon />,
        path: "pagos",
        permission: "ver_pagos",
      },
      {
        text: "Cotizaciones",
        icon: <RequestQuoteOutlinedIcon />,
        path: "cotizaciones",
        permission: "ver_cotizaciones",
      },
      {
        text: "Pedidos",
        icon: <ShoppingCartOutlined />,
        path: "pedidos",
        permission: "ver_pedidos",
      },
      {
        text: "Ventas",
        icon: <PointOfSaleOutlined />,
        path: "ventas",
        permission: "ver_ventas",
      },
      {
        text: "Clientes",
        icon: <Groups2Outlined />,
        path: "clientes",
        permission: "ver_clientes",
      },
    ],
  },
  {
    name: "Modulo Inventario",
    permission: "ver_productos",
    children: [
      {
        text: "Productos",
        icon: <Inventory2OutlinedIcon />,
        path: "productos",
        permission: "ver_productos",
      },
      {
        text: "Insumos",
        icon: <WarehouseOutlined />,
        path: "insumos",
        permission: "ver_insumos",
      },
      {
        text: "Categorias",
        icon: <CategoryOutlined />,
        path: "categorias",
        permission: "ver_categorias",
      },
    ],
  },
  {
    name: "Modulo Entregas",
    permission: "ver_entregas",
    children: [
      {
        text: "Ventas Chofer",
        icon:<ReceiptOutlinedIcon/> ,
        path: "ventas-chofer",
        permission: "ver_ventas_chofer",
      },
      {
        text: "Entregas Realizadas",
        icon: <AssignmentTurnedInIcon />,
        path: "entregas-completadas",
        permission: "ver_entregas_realizadas",
      },
      {
        text: "Asignadas",
        icon: <AssignmentOutlinedIcon />,
        path: "entregas",
        permission: "ver_entregas_asignadas",
      },
      {
        text: "Camiones",
        icon: <LocalShippingOutlinedIcon />,
        path: "camiones",
        permission: "ver_camiones",
      },
      {
        text: "Agenda Carga",
        icon: <EventIcon />,
        path: "agendas",
        permission: "ver_agenda_carga",
      },
    ],
  },
  /* {
    name: "Modulo Agenda",
    children: [
      {
        text: "Camiones",
        icon: <EventIcon/>,
        path: "agendas",
      },
      {
        text: ""
      }
    ]
  }, */
  /*   {
    name: "Modulo Geografía",
    children: [
      {
        text: "Geography",
        icon: <PublicOutlined />,
        path: "geography",
      },
    ],
  }, */
  /*   {
    name: "Modulo Proveedores",
    children: [
      {
        text: "Proveedores",
        icon: <PeopleAltOutlined />,
        path: "proveedores",
      },
      {
        text: "Mensajes",
        icon: <ChatOutlined />,
        path: "mensajes",
      },
    ],
  }, */
  {
    name: "Modulo Analytics",
    permission: "ver_estadisticas",
    children: [
      {
        text: "Estadisticas",
        icon: <PieChartOutlined />,
        path: "estadisticas",
        permission: "ver_estadisticas",
      },
    ],
  },
  {
    name: "Gestion",
    permission: "ver_admin",
    children: [
      {
        text: "Admin",
        icon: <AdminPanelSettingsOutlined />,
        path: "admin",
        permission: "ver_admin",
      },
      {
        text: "Rendimiento",
        icon: <TrendingUpOutlined />,
        path: "rendimiento",
        permission: "ver_rendimiento",
      },
    ],
  },
];

const Sidebar = ({
  user,
  rol,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [openSections, setOpenSections] = useState({});
  const permisos = useSelector((state) => state.auth.permisos);

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // Función para togglear secciones
  const handleToggleSection = (moduleName) => {
    setOpenSections((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setActive(path);
  };

  //const sidebarBgColor = getSidebarColor(user.rol?.nombre, theme);
  const hasPermission = (permission) => {
    return permisos.includes(permission);
  };

  return (
    <Box component="nav">
      {isSidebarOpen && isNonMobile && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary[500]
                  : theme.palette.secondary[1000],
              backgroundColor: theme.palette.sidebar.main,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              overflowY: "scroll", // Permite scroll vertical
              "&::-webkit-scrollbar": {
                display: "none", // Oculta la barra en navegadores basados en Webkit (Chrome, Edge)
              },
              "msOverflowStyle": "none", // Oculta la barra en IE y Edge
              "scrollbarWidth": "none",
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <Box
                color={theme.palette.secondary.main}
                justifyContent="center"
                display="flex"
                alignItems="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  src={logoImage}
                  alt="logo"
                  height="56.59px"
                  width="100px"
                  component="img"
                />
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </Box>
            </Box>
            <List>
              {modulesData
                .filter(
                  (module) =>
                    !module.permission || hasPermission(module.permission)
                )
                .map((module) => {
                  // Si no tiene hijos, es un item directo
                  if (!module.children) {
                    return (
                      <ListItemButton
                        key={module.name}
                        onClick={() => handleNavigate(module.path)}
                        sx={{
                          backgroundColor:
                            active === module.path
                              ? theme.palette.mode === "dark"
                                ? theme.palette.primary[100]
                                : theme.palette.primary[300]
                              : "transparent",
                          color:
                            active === module.path
                              ? theme.palette.mode === "dark"
                                ? theme.palette.primary[900]
                                : theme.palette.primary[100]
                              : "inherit",
                          "&:hover": {
                            backgroundColor:
                              active === module.path
                                ? theme.palette.mode === "dark"
                                  ? theme.palette.primary[100] // Mantén el fondo del activo
                                  : theme.palette.primary[300]
                                : theme.palette.mode === "dark"
                                ? theme.palette.primary[200]
                                : theme.palette.primary[300], // Cambia el color solo si no está activo
                            color:
                              active === module.path
                                ? theme.palette.mode === "dark"
                                  ? theme.palette.primary[900]
                                  : theme.palette.primary[50] // Mantén el color del texto del activo
                                : theme.palette.mode === "dark"
                                ? theme.palette.primary[900]
                                : theme.palette.primary[50],
                          },
                        }}
                      >
                        {/* Icono si lo tiene */}
                        {module.icon && (
                          <ListItemIcon
                            sx={{
                              color:
                                active === module.path
                                  ? theme.palette.mode === "dark"
                                    ? theme.palette.primary[900]
                                    : theme.palette.primary[100]
                                  : "inherit",
                            }}
                          >
                            {module.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={module.name} />
                        {active === module.path && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    );
                  }

                  // Si tiene hijos, es un "módulo" con subitems
                  return (
                    <Box key={module.name}>
                      {/* Botón principal de la sección */}
                      <ListItemButton
                        onClick={() => handleToggleSection(module.name)}
                        sx={{
                          // style del botón del módulo
                          color: "inherit",
                        }}
                      >
                        {/* Icono si lo deseas */}
                        {module.icon && (
                          <ListItemIcon sx={{ color: "#ffffff" }}>
                            {module.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={module.name} />
                        {/* Flechita de expandir/colapsar */}
                        {openSections[module.name] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>

                      {/* Sublista colapsable */}
                      <Collapse
                        in={!!openSections[module.name]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {module.children
                            .filter((child) => hasPermission(child.permission))
                            .map((child) => (
                              <ListItemButton
                                key={child.text}
                                onClick={() => handleNavigate(child.path)}
                                sx={{
                                  pl: 4, // padding-left extra para "indentar"
                                  backgroundColor:
                                    active === child.path
                                      ? theme.palette.mode === "dark"
                                        ? theme.palette.primary[100]
                                        : theme.palette.primary[300]
                                      : "transparent",
                                  color:
                                    active === child.path
                                      ? theme.palette.mode === "dark"
                                        ? theme.palette.primary[100]
                                        : theme.palette.primary[100]
                                      : "inherit",
                                  "&:hover": {
                                    backgroundColor:
                                      active === module.path
                                        ? theme.palette.primary[500] // Mantiene el color si está activo
                                        : theme.palette.grey[300], // Cambia solo para hover si no está activo
                                    color:
                                      active === module.path
                                        ? theme.palette.primary[1000]
                                        : theme.palette.primary[100], // Cambia color de texto para hover
                                  },
                                }}
                              >
                                {/* Icono del sub-item */}
                                {child.icon && (
                                  <ListItemIcon
                                    sx={{
                                      color:
                                        active === child.path
                                          ? theme.palette.mode === "dark"
                                            ? theme.palette.primary[900]
                                            : theme.palette.primary[100]
                                          : "inherit",
                                    }}
                                  >
                                    {child.icon}
                                  </ListItemIcon>
                                )}
                                <ListItemText primary={child.text} />
                                {active === child.path && (
                                  <ChevronRightOutlined sx={{ ml: "auto" }} />
                                )}
                              </ListItemButton>
                            ))}
                        </List>
                      </Collapse>
                    </Box>
                  );
                })}
            </List>
          </Box>

          <Box /* position="absolute" */ bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box>
                <AccountCircleIcon fontSize="large" />
              </Box>
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[1000],
                  }}
                >
                  {user?.nombre || ""}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[1000],
                  }}
                >
                  {rol || ""}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary[100]
                      : theme.palette.secondary[1000],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
      {/* Bottom navigation bar for mobile */}
      {!isNonMobile && (
        <BottomNavigation
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          }}
          value={active}
          onChange={(event, newValue) => {
            setActive(newValue);
            navigate(`/${newValue}`);
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="dashboard"
            icon={<HomeOutlined />}
          />
          <BottomNavigationAction
            label="Orders"
            value="pedidos"
            icon={<ShoppingCartOutlined />}
          />
          <BottomNavigationAction
            label="Clients"
            value="clientes"
            icon={<Groups2Outlined />}
          />
          <BottomNavigationAction
            label="Products"
            value="productos"
            icon={<Inventory2OutlinedIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            icon={<PersonOutline />}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default Sidebar;
