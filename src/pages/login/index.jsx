import React, { useEffect, useRef, useState } from "react";
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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ rut: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(credentials).unwrap();
      dispatch(
        showNotification({
          message: "Inicio de sesión exitoso.",
          severity: "success",
        })
      );
      navigate("/dashboard");
    } catch (error) {
      dispatch(
        showNotification({
          message: error?.data?.error || "Error al iniciar sesión.",
          severity: "error",
        })
      );
    }
  };

  // Redirige automáticamente si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true }); // Redirige al dashboard
    }
  }, [isAuthenticated, navigate]);

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
            style: { fontSize: "1.2rem" },
          }}
          InputProps={{ style: { fontSize: "1.2rem" } }}
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
            style: { fontSize: "1.2rem" },
          }}
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
