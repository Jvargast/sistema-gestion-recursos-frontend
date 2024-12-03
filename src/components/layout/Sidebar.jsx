import {
  BottomNavigationAction,
  BottomNavigation,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  WarehouseOutlined,
  PeopleAltOutlined,
  ChatOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "../../assets/images/profile.jpeg";
import logoImage from "../../assets/images/logo_aguas_valentino2.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Módulo Ventas",
    icon: null,
  },
  {
    text: "Facturas",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Pagos",
    icon: <PaymentOutlinedIcon />,
  },
  {
    text: "Cotizaciones",
    icon: <RequestQuoteOutlinedIcon />,
  },
  {
    text: "Pedidos",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Ventas",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Clientes",
    icon: <Groups2Outlined />,
  },
  {
    text: "Módulo Inventario",
    icon: null,
  },
  {
    text: "Productos",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    text: "Insumos",
    icon: <WarehouseOutlined />,
  },
  {
    text: "Módulo Geografía",
    icon: null,
  },
  {
    text: "Geography",
    icon: <PublicOutlined />,
  },
  {
    text: "Módulo Proveedores",
    icon: null,
  },
  {
    text: "Proveedores",
    icon: <PeopleAltOutlined />,
  },
  {
    text: "Mensajes",
    icon: <ChatOutlined />,
  },
  {
    text: "Módulo Análisis",
    icon: null,
  },
  {
    text: "Daily",
    icon: <TodayOutlined />,
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
  },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "Administración",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "Rendimiento",
    icon: <TrendingUpOutlined />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

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
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
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
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={
                        theme.palette.mode === "dark"
                          ? {
                              backgroundColor:
                                active === lcText
                                  ? theme.palette.primary[100]
                                  : "transparent",
                              color:
                                active === lcText
                                  ? theme.palette.primary[900]
                                  : theme.palette.primary[500],
                            }
                          : {
                              backgroundColor:
                                active === lcText
                                  ? theme.palette.secondary[900]
                                  : "transparent",
                              color:
                                active === lcText
                                  ? theme.palette.primary[100]
                                  : theme.palette.secondary[1000],
                            }
                      }
                    >
                      <ListItemIcon
                        sx={
                          theme.palette.mode === "dark"
                            ? {
                                ml: "2rem",
                                color:
                                  active === lcText
                                    ? theme.palette.primary[900]
                                    : theme.palette.grey[1000],
                              }
                            : {
                                ml: "2rem",
                                color:
                                  active === lcText
                                    ? theme.palette.primary[100]
                                    : theme.palette.secondary[1000],
                              }
                        }
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box /* position="absolute" */ bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              {/* <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              /> */}
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
                  {user.nombre}
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
                  {user.rol.nombre}
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
