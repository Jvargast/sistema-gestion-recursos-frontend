import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../state/reducers/globalSlice";
import profileImage from "../../assets/images/profile.jpeg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useLogoutMutation } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { resetCacheAndLogout } from "../../state/reducers/authSlice";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.global.mode);
  const theme = useTheme();

  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(resetCacheAndLogout());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton
            sx={{
              display: `${isNonMobile ? "" : "none"}`,
              color: `${mode === "dark" ? "#FFFFFF" : "#000000"}`,
            }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={
              theme.palette.mode === "dark" ? "#000000" : "#FFFFFF"
            }
            borderRadius="2rem"
            gap="3rem"
            p="0.1rem 1.5rem"
            border="1px solid #5c5c5a"
          >
            <InputBase placeholder="Buscar..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          {/* <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlined sx={{ fontSize: "25px", color: "#ffffff" }} />
            ) : (
              <DarkModeOutlined sx={{ fontSize: "25px", color: "#0D497D" }} />
            )}
          </IconButton> */}
          <IconButton>
            {theme.palette.mode === "dark" ? (
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: "25px", color: "#ffffff" }}
              />
            ) : (
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: "25px", color: "#0D497D" }}
              />
            )}
          </IconButton>
          <IconButton>
            {theme.palette.mode === "dark" ? (
              <SettingsOutlined sx={{ fontSize: "25px", color: "#ffffff" }} />
            ) : (
              <SettingsOutlined sx={{ fontSize: "25px", color: "#0D497D" }} />
            )}
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              {/* <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              /> */}
              <Box>
                <AccountCircleIcon fontSize="large" />
              </Box>
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[100],
                  }}
                >
                  {user.nombre}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[100],
                  }}
                >
                  {user.rol.nombre}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
