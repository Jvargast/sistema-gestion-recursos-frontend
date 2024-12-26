import React from "react";
import { Box, Typography, Switch, Divider, Button } from "@mui/material";

const SecuritySettings = ({ settings, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h5" className="font-bold mb-4 text-gray-800">
        Configuraciones de Seguridad
      </Typography>
      <Box className="mb-4">
        <Box className="flex items-center justify-between py-2">
          <Typography>Autenticación de Dos Factores (2FA)</Typography>
          <Switch
            color="primary"
            checked={settings.twoFactorEnabled}
            disabled
            onChange={(e) => onUpdate("twoFactorEnabled", e.target.checked)}
          />
        </Box>
        <Divider />
      </Box>
      <Box className="mb-4">
        <Box className="flex items-center justify-between py-2">
          <Typography>Bloqueo por intentos fallidos</Typography>
          <Switch
            color="primary"
            checked={settings.lockoutEnabled}
            disabled
            onChange={(e) => onUpdate("lockoutEnabled", e.target.checked)}
          />
        </Box>
        <Divider />
      </Box>
      <Button
        variant="contained"
        color="primary"
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
        disabled
      >
        Guardar Cambios
      </Button>
    </Box>
  );
};

export default SecuritySettings;
