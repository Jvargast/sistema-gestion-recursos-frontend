import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";

const AssignModal = ({ open, onClose, onSubmit, choferes }) => {
  const [selectedChofer, setSelectedChofer] = useState(null);

  const handleAssign = () => {
    if (selectedChofer) onSubmit(selectedChofer);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Asignar Chofer</h2>
        <Autocomplete
          options={choferes}
          getOptionLabel={(option) =>
            `${option.nombre} ${option.apellido ? option.apellido : ""}`.trim()
          }
          onChange={(e, value) => setSelectedChofer(value)}
          renderInput={(params) => (
            <TextField {...params} label="Seleccionar Chofer" />
          )}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} color="error">
            Cancelar
          </Button>
          <Button onClick={handleAssign} variant="contained" sx={{ ml: 2 }}>
            Asignar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignModal;
