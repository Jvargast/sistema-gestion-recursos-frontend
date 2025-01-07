import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block";
import { useHasPermission } from "../../hooks/useHasPermission";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const hasPermission = useHasPermission("ver_usuario");
  console.log(hasPermission);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        animation: "fadeIn 0.5s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "error.main",
          color: "white",
          borderRadius: "50%",
          width: 100,
          height: 100,
          mb: 3,
          animation: "bounce 1s infinite",
          "@keyframes bounce": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
        }}
      >
        <BlockIcon sx={{ fontSize: 50 }} />
      </Box>
      <Typography variant="h4" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        No tienes el permiso para ver esta página.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          navigate("/dashboard");
        }}
        sx={{
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontSize: "1rem",
          borderRadius: 2,
        }}
      >
        {hasPermission ? "Volver al Dashboard" : "Ir al Login"}
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
