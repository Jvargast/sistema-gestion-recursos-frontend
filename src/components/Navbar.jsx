import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "../components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
import profileImage from "../assets/profile.jpeg";
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

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

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
            sx={{ display: `${isNonMobile ? "" : "none"}`, color: `${theme.palette.mode === "dark" ? "#FFFFFF":"#000000"}` }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.mode === "dark" ? "#000000":"#FFFFFF"}
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
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlined sx={{ fontSize: "25px", color: "#ffffff" }} />
            ) : (
              
              <DarkModeOutlined sx={{ fontSize: "25px", color: "#0D497D" }} />
            )}
          </IconButton>
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
              <SettingsOutlined
                sx={{ fontSize: "25px" , color: "#ffffff" }}
              />
            ) : (
              <SettingsOutlined
                sx={{ fontSize: "25px" , color: "#0D497D" }}
              />
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
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.mode === "dark" ? theme.palette.primary[100] : theme.palette.secondary[100] }}
                >
                  Usuario{user.name}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.mode === "dark" ? theme.palette.primary[100] : theme.palette.secondary[100] }}
                >
                  Rol{user.occupation}
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
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
