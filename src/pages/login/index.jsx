import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useGetAuthenticatedUserQuery,
} from "../../services/authApi";
import logoImage from "../../assets/images/logoLogin.png"

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ rut: "", password: "" });
  const [login] = useLoginMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async () => {
    try {
      await login(credentials).unwrap();
      setShouldFetchUser(true);
      //if (data)
      //navigate("/dashboard"); // Redirige al dashboard
    } catch (error) {
      alert("Error al iniciar sesión");
      console.error(error);
    }
  };
  // Estado para habilitar el query /auth/me
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const {
    data: user,
    isLoading,
    isError,
  } = useGetAuthenticatedUserQuery(undefined, {
    skip: !shouldFetchUser, // No se ejecuta automáticamente
  });
  // Redirige al dashboard una vez que se obtiene el usuario
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      {/* <Typography variant="h4" sx={{ mb: 4 }}>
        Aguas Valentino
      </Typography> */}
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
        <TextField
          label="Rut / Correo"
          name="rut"
          value={credentials.rut}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" onClick={handleLogin} fullWidth>
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
        {isError && <p>Error al cargar datos del usuario</p>}
      </Box>
    </Box>
  );
};

export default Login;
