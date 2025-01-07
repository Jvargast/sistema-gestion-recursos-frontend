import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useGetOwnProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
} from "../../services/usuariosApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "rsuite";

const PerfilUsuario = () => {
  const { data: perfil, isLoading, isError, refetch } = useGetOwnProfileQuery();
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError || !perfil?.data) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar el perfil
        </Typography>
      </Box>
    );
  }

  const {
    rut,
    nombre,
    apellido,
    email,
    fecha_registro,
    ultimo_login,
    rol,
    Empresa,
    Sucursal,
  } = perfil.data;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMyProfile(formData);
      dispatch(
        showNotification({
          message: "Perfil actualizado correctamente",
          severity: "success",
        })
      );
      setEditMode(false);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al actualizar el perfil",
          severity: "error",
        })
      );
    }
  };

  const handlePasswordSave = async () => {
    try {
      await changePassword(passwordData);
      dispatch(
        showNotification({
          message: "Contraseña actualizada correctamente",
          severity: "success",
        })
      );
      setPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al actualizar la contraseña",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Box className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex items-center mb-6">
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: "primary.main" }}
                className="text-4xl font-bold mr-6"
              >
                {nombre[0]}
              </Avatar>
              <Typography variant="h4" className="font-bold text-gray-800">
                {nombre} {apellido}
              </Typography>
            </Box>

            <Divider className="my-4" />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="text-gray-600">
                  <strong>RUT:</strong> {rut}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    defaultValue={nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Typography variant="subtitle1" className="text-gray-600">
                    <strong>Nombre:</strong> {nombre}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    defaultValue={apellido}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Typography variant="subtitle1" className="text-gray-600">
                    <strong>Apellido:</strong> {apellido}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    defaultValue={email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Typography variant="subtitle1" className="text-gray-600">
                    <strong>Email:</strong> {email}
                  </Typography>
                )}
              </Grid>
              {!editMode && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="text-gray-600">
                      <strong>Rol:</strong> {rol.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="text-gray-600">
                      <strong>Empresa:</strong> {Empresa.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="text-gray-600">
                      <strong>Sucursal:</strong> {Sucursal.nombre}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            <Divider className="my-4" />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="text-gray-600">
                  <strong>Fecha de registro:</strong>{" "}
                  {new Date(fecha_registro).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="text-gray-600">
                  <strong>Último login:</strong>{" "}
                  {new Date(ultimo_login).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Box className="flex justify-end mt-4">
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setEditMode(false)}
                    className="ml-4"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                >
                  Editar Perfil
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setPasswordModalOpen(true)}
                className="ml-4"
              >
                Cambiar Contraseña
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Modal para cambiar contraseña */}
        <Dialog
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
        >
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogContent>
            <Box className="relative">
              <TextField
                fullWidth
                margin="dense"
                label="Contraseña Actual"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                onChange={handlePasswordChange}
              />
              <IconButton
                className="absolute right-2 top-2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            <Box className="relative">
              <TextField
                fullWidth
                margin="dense"
                label="Nueva Contraseña"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                onChange={handlePasswordChange}
              />
              <IconButton
                className="absolute right-2 top-2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            <Box className="relative">
              <TextField
                fullWidth
                margin="dense"
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={handlePasswordChange}
              />
              <IconButton
                className="absolute right-2 top-2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordSave}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PerfilUsuario;
