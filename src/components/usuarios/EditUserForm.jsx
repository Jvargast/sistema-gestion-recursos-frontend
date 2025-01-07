import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid2,
  TextField,
  InputAdornment,
} from "@mui/material";
import InfoFieldGroup from "../common/InfoFieldGroup";
import LoaderComponent from "../common/LoaderComponent";
import { IconButton } from "rsuite";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EditUserForm = ({
  userId,
  fetchUserData, // Hook o función para obtener datos del usuario
  updateUser, // Hook o función para actualizar datos del usuario
  onCancel, // Función para manejar cancelación
  onSuccess, // Función para manejar éxito
  onError, // Función para manejar errores
  fieldConfig, // Configuración dinámica de los campos del formulario
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserData(userId);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        onError && onError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, fetchUserData, onError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await updateUser(userId, formData);
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
      onError && onError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) return <LoaderComponent />;

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Editar Usuario
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Información del Usuario
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid2 container spacing={2}>
          {fieldConfig.flatMap((group, groupIndex) =>
            group.map((field, fieldIndex) => (
              <Grid2
                key={`${groupIndex}-${fieldIndex}`}
                xs={12}
                sm={6}
                md={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {field.name === "password" ? (
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={field.disabled || false}
                  />
                ) : (
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    fullWidth
                    select={field.type === "select"}
                    SelectProps={{ native: true }}
                    disabled={field.disabled || false}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    
                  </TextField>
                )}
              </Grid2>
            ))
          )}
        </Grid2>
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel || (() => navigate(-1))}
            sx={{
              height: "3rem",
              width: "250px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isUpdating}
            sx={{
              height: "3rem",
              width: "250px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

EditUserForm.propTypes = {
  userId: PropTypes.string.isRequired,
  fetchUserData: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  fieldConfig: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
          })
        ),
        disabled: PropTypes.bool,
      })
    )
  ).isRequired,
};

export default EditUserForm;
