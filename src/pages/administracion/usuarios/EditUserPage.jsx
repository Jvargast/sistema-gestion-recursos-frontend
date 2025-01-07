import { useParams } from "react-router-dom";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import {
  useFindByRutQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} from "../../../services/usuariosApi";
import { useGetAllEmpresasQuery, useGetAllSucursalsQuery } from "../../../services/empresaApi";
import { useGetAllRolesQuery } from "../../../services/rolesApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import EditUserForm from "../../../components/usuarios/EditUserForm";

const EditUserPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: "" });

  // Fetch user data
  const { data: userData, isFetching, error: fetchError } = useFindByRutQuery(id);
  const [updateUser] = useUpdateUserMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();

  // Fetch additional data for form
  const { data: empresas } = useGetAllEmpresasQuery();
  const { data: sucursales } = useGetAllSucursalsQuery();
  const { data: rolesData } = useGetAllRolesQuery();

  const handleUpdateUser = async (userId, data) => {
    try {
      await updateUser({ id: userId, ...data }).unwrap();
      dispatch(
        showNotification({
          message: "Usuario actualizado correctamente.",
          severity: "success",
          duration: 3000,
        })
      );
    } catch (err) {
      dispatch(
        showNotification({
          message: `Error al actualizar el usuario: ${err?.data?.error || "Desconocido"}`,
          severity: "error",
          duration: 3000,
        })
      );
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updateUserPassword({ rut: id, newPassword: passwordData.newPassword });
      dispatch(
        showNotification({
          message: "Contraseña actualizada correctamente.",
          severity: "success",
        })
      );
      setPasswordModalOpen(false);
      setPasswordData({ newPassword: "" });
    } catch (err) {
      dispatch(
        showNotification({
          message: `Error al cambiar la contraseña: ${err?.data?.error || "Desconocido"}`,
          severity: "error",
        })
      );
    }
  };

  if (isFetching) {
    return <LoaderComponent />;
  }

  if (fetchError) {
    return <div>Error al cargar el usuario: {fetchError.message}</div>;
  }

  const rolesOptions = rolesData?.roles.map((role) => ({ value: role.id, label: role.nombre })) || [];
  const empresasOptions = empresas?.map((empresa) => ({ value: empresa.id_empresa, label: empresa.nombre })) || [];
  const sucursalesOptions = sucursales?.map((sucursal) => ({ value: sucursal.id_sucursal, label: sucursal.nombre })) || [];

  const fieldConfig = [
    [
      { label: "RUT", name: "rut", type: "text", disabled: true },
      { label: "Nombre", name: "nombre", type: "text" },
      { label: "Apellido", name: "apellido", type: "text" },
      { label: "Email", name: "email", type: "email" },
    ],
    [
      {
        label: "Estado",
        name: "activo",
        type: "select",
        options: [
          { value: true, label: "Activo" },
          { value: false, label: "Inactivo" },
        ],
      },
      {
        label: "Rol",
        name: "rolId",
        type: "select",
        options: rolesOptions,
      },
    ],
    [
      {
        label: "Empresa",
        name: "id_empresa",
        type: "select",
        options: empresasOptions,
      },
      {
        label: "Sucursal",
        name: "id_sucursal",
        type: "select",
        options: sucursalesOptions,
      },
    ],
  ];

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <EditUserForm
            userId={id}
            fetchUserData={() => userData}
            updateUser={handleUpdateUser}
            fieldConfig={fieldConfig}
            onSuccess={() => console.log("Usuario actualizado correctamente")}
            onError={(err) => console.error("Error:", err)}
          />
          <Divider className="my-4" />
          <Box className="flex justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPasswordModalOpen(true)}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal para cambiar contraseña */}
      <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nueva Contraseña"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ newPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setPasswordModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordChange}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditUserPage;
