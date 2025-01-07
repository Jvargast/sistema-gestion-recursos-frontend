import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import ReactSelect from "react-select";
import ProductDetailsCamion from "./ProductDetailsCamion";

const ModalVentaRapidaChofer = ({ open, onClose, onSubmit, fields, title }) => {
  const [formData, setFormData] = useState(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
      {}
    )
  );

  useEffect(() => {
    if (open) {
      setFormData(
        fields.reduce(
          (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
          {}
        )
      );
    }
  }, [fields, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (details) => {
    setFormData((prev) => ({
      ...prev,
      productos: details,
    }));
  };

  const handleSubmit = () => {
    const processedFormData = { ...formData };

    // Validar campos obligatorios
    if (
      !processedFormData.cliente_rut ||
      !processedFormData.metodo_pago ||
      !processedFormData.monto
    ) {
      alert("Todos los campos obligatorios deben ser completados.");
      return;
    }

    // Convertir monto a número
    if (processedFormData.monto) {
      processedFormData.monto = parseFloat(processedFormData.monto);
    }

    onSubmit(processedFormData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => {
          if (field.name === "productos") {
            return (
              <Box key={field.name} mb={2}>
                <Typography variant="h6">{field.label}</Typography>
                <ProductDetailsCamion
                  key={field.name}
                  value={formData.productos}
                  onChange={handleDetailsChange}
                  productos={field.productos}
                  setSearchTerm={field.setSearchTerm}
                />
              </Box>
            );
          }

          switch (field.type) {
            case "text":
            case "number":
              return (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                />
              );

            case "select":
              if (field.searchable) {
                return (
                  <Box key={field.name} mb={2}>
                    <Typography variant="h6">{field.label}</Typography>
                    <ReactSelect
                      options={[
                        ...field.options, // Existing client options
                        { value: "create", label: field.searchOption }, // Add "Agregar Nuevo Cliente" option
                      ]}
                      placeholder="Buscar cliente..."
                      value={
                        field.options.find(
                          (option) => option.value === formData[field.name]
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        if (selectedOption.value === "create") {
                          field.onCreateNewClient(); // Invoke the callback to open ModalCrearCliente
                        } else {
                          handleSelectChange(field.name, selectedOption.value);
                        }
                      }}
                      isSearchable
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </Box>
                );
              } else {
                return (
                  <FormControl key={field.name} fullWidth margin="dense">
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

            default:
              return null;
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalVentaRapidaChofer;
