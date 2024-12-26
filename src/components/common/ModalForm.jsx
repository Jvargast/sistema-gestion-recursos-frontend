import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../venta/ProductDetails";

const ModalForm = ({ open, onClose, onSubmit, fields, title }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
      {}
    )
  );
  // Sincroniza `formData` cuando `fields` cambian
  useEffect(() => {
    setFormData(
      fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
        {}
      )
    );
  }, [fields]);
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
      detalles: details,
    }));
  };

  const handleSubmit = () => {
    const processedFormData = { ...formData };

    // Convertir monto a número
    if (processedFormData.monto) {
      processedFormData.monto = parseFloat(processedFormData.monto);
    }
    onSubmit(processedFormData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => {
          if (field.name === "detalles") {
            return (
              <ProductDetails
                key={field.name}
                value={formData.detalles}
                onChange={handleDetailsChange}
                productos={field.productos}
                setSearchTerm={field.setSearchTerm}
              />
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
                // Si el campo admite búsqueda, usa react-select
                return (
                  <div key={field.name} style={{ marginBottom: "16px" }}>
                    <label style={{ marginBottom: "8px", display: "block" }}>
                      {field.label}
                    </label>
                    <ReactSelect
                      options={[
                        ...field.options,
                        {
                          value: "create",
                          label: `${field.searchOption}`,
                        },
                      ]}
                      placeholder="Buscar..."
                      value={field.options.find(
                        (option) => option.value === formData[field.name]
                      )}
                      onChange={(selectedOption) => {
                        if (selectedOption.value === "create") {
                          navigate(`${field.route}`); // Redirige a la creación de clientes
                        } else {
                          handleSelectChange(field.name, selectedOption.value);
                        }
                      }}
                      isSearchable
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que el z-index sea alto
                      }}
                    />
                  </div>
                );
              } else {
                // Comportamiento normal para selects estándar
                return (
                  <FormControl key={field.name} fullWidth margin="dense">
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                    >
                      {field.options.map((option, index) => (
                        <MenuItem
                          key={option.value || index}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
            case "checkbox":
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Checkbox
                      name={field.name}
                      checked={formData[field.name]}
                      onChange={handleChange}
                    />
                  }
                  label={field.label}
                />
              );
            default:
              return null;
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;
