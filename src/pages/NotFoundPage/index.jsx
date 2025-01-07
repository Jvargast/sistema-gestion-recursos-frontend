import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useHasPermission } from "../../hooks/useHasPermission";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const hasPermission = useHasPermission("ver_dashboard");
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
          width: 120,
          height: 120,
          mb: 3,
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          },
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 70 }} />
      </Box>
      <Typography
        variant="h1"
        sx={{ fontSize: "6rem", fontWeight: "bold" }}
        gutterBottom
      >
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Oops! La página que estas buscando no exite.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          if (hasPermission) {
            navigate("/dashboard"); // Redirige al dashboard si tiene permiso
          } else {
            navigate("/login"); // Redirige al login si no tiene permiso
          }
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

export default NotFoundPage;
