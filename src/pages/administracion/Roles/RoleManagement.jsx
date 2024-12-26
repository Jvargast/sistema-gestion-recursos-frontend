import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid2,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
} from "../../../services/rolesApi";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { useDispatch } from "react-redux";
import AlertDialog from "../../../components/common/AlertDialog";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import BackButton from "../../../components/common/BackButton";

const RoleManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createRole] = useCreateRoleMutation();
  const dispatch = useDispatch();
  const [deleteRole] = useDeleteRoleMutation();

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const { data: roles, isLoading, isError, refetch } = useGetAllRolesQuery();

  const handleCreateRole = async () => {
    //const newRole = { nombre: "Nuevo Rol", descripcion: "Descripción del rol" };
    //await createRole(newRole);
    dispatch(showNotification({
      message: "Método no implementado ",
      severity: "info"
    }))
  };

  const confirmDeleteRole = (id) => {
    setSelectedRoleId(id);
    setOpenAlert(true);
  };

  const handleDeleteRole = async (id) => {
    await deleteRole(selectedRoleId);
    dispatch(
      showNotification({
        message: "Rol eliminado correctamente",
        severity: "success",
        duration: 3000,
      })
    );
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/roles", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading) return <LoaderComponent />;

  if (isError)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar los roles
        </Typography>
      </Box>
    );

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <BackButton to="/admin" label="Volver al menú" />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="font-bold text-gray-800">
          Gestión de Roles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateRole}
          className="bg-blue-500 hover:bg-blue-600 text-lg"
        >
          Añadir Rol
        </Button>
      </Box>

      <Grid2 container spacing={4} className="text-lg">
        {roles?.roles?.map((role) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={role.id}>
            <Card className="shadow-lg hover:shadow-xl transitio text-lg">
              <CardContent>
                <Typography
                  variant="h5"
                  className="font-semibold text-gray-700 capitalize"
                >
                  {role.nombre}
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-2">
                  {role.descripcion}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-4"
                >
                  Permisos Aprobados: {role.permissionsCount?.approved || 0}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-2"
                >
                  Permisos Denegados: {role.permissionsCount?.notApproved || 0}
                </Typography>
              </CardContent>
              <CardActions className="flex justify-between">
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/roles/editar/${role.id}`)}
                  className="text-lg"
                >
                  Editar Permisos
                </Button>
                <Button
                  size="medium"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => confirmDeleteRole(role.id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteRole}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default RoleManagement;
