import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logoLogin.png";
import { useLoginMutation } from "../../services/authApi";
import { useSelector, useDispatch } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { setUser } from "../../state/reducers/authSlice";
import { API_URL } from "../../services/apiBase";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ rut: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, rol, permisos } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const getInitialRoute = (rol, permissions) => {
    if (rol === "administrador" && permissions.includes("ver_dashboard")) {
      return "/dashboard";
    } else if (rol === "vendedor" && permissions.includes("ver_ventas")) {
      return "/ventas";
    } else if (rol === "chofer" && permissions.includes("ver_entregas")) {
      return "/entregas";
    }
    // Ruta por defecto si no tiene permisos específicos
    return "/unauthorized";
  };

  // Redirige automáticamente si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      // Obtener permisos desde el estado global
      if (isAuthenticated) {
        // Determinar la ruta inicial en base al rol y los permisos
        const initialRoute = getInitialRoute(rol, permisos);
        navigate(initialRoute, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, permisos, rol]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(credentials).unwrap();
      const meResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL || API_URL}/auth/me`,
        { method: "GET", credentials: "include" }
      ).then((res) => res.json());
      dispatch(setUser(meResponse));
      const { rol, permisos } = meResponse;
      const initialRoute = getInitialRoute(rol, permisos);
      navigate(initialRoute, { replace: true });
      dispatch(
        showNotification({
          message: "Inicio de sesión exitoso.",
          severity: "success",
        })
      );
      //navigate("/dashboard", { replace: true });
    } catch (error) {
      dispatch(
        showNotification({
          message: error?.data?.error || "Error al iniciar sesión.",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Box justifyContent="center" display="flex" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          gap="0.5rem"
          src={logoImage}
          alt="logo"
          height="104.83px"
          width="200px"
          component="img"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="1.5rem"
        width="300px"
        p="2rem"
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          sx={{ fontSize: "1.8rem" }}
        >
          Iniciar Sesión
        </Typography>
        <TextField
          label="Rut"
          name="rut"
          value={credentials.rut}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
            style: { fontSize: "1.2rem" },
          }}
          InputProps={{ style: { fontSize: "1.2rem" } }}
          autoComplete="username"
        />
        <TextField
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          InputProps={{
            style: { fontSize: "1.2rem" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: "1.2rem" },
          }}
          autoComplete="current-password"
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            fontSize: "1.2rem",
            padding: "0.8rem",
          }}
        >
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
