import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { useGetAllpermisosQuery } from "../../../services/permisosRolesApi";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../services/rolesApi";
import { showNotification } from "../../../state/reducers/notificacionSlice";
import { useDispatch } from "react-redux";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: role, isLoading, refetch } = useGetRoleByIdQuery(id);
  const { data: permisos } = useGetAllpermisosQuery();
  const [updateRole] = useUpdateRoleMutation();
  const [selectedPermisos, setSelectedPermisos] = useState([]);

  useEffect(() => {
    if (role && role.rolesPermisos) {
      setSelectedPermisos(role.rolesPermisos.map((rp) => rp.permiso.id));
    }
  }, [role]);

  const handleTogglePermiso = (permisoId) => {
    setSelectedPermisos((prev) =>
      prev.includes(permisoId)
        ? prev.filter((id) => id !== permisoId)
        : [...prev, permisoId]
    );
  };

  const handleSave = async () => {
    try {
      const updatedRole = {
        ...role,
        permisos: selectedPermisos,
      };

      await updateRole({ id, updatedRole });
      refetch();
      dispatch(
        showNotification({
          message: "Permisos actualizados con éxito",
          severity: "success",
        })
      );
      navigate("/roles", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar los permisos: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Box className="p-6 bg-gray-100">
      <Typography variant="h4" className="font-bold mb-4">
        Editar Rol: {role?.nombre}
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigate("/roles")}
        sx={{mt:2, mb:2}}
      >
        Cancelar
      </Button>
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h4" className="font-bold mb-4">
            Permisos Asociados
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize:"1rem"}}>Permiso</TableCell>
                  <TableCell sx={{fontSize:"1rem"}}>Descripción</TableCell>
                  <TableCell sx={{fontSize:"1rem"}}>Activado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{fontSize: "1.2rem"}}>
                {permisos?.permisos.map((permiso) => (
                  <TableRow key={permiso.id} >
                    <TableCell sx={{fontSize:"1rem"}}>{permiso.nombre}</TableCell>
                    <TableCell sx={{fontSize:"1rem"}}>{permiso.descripcion}</TableCell>
                    <TableCell sx={{fontSize:"1rem"}}>
                      <Switch
                        checked={selectedPermisos.includes(permiso.id)}
                        onChange={() => handleTogglePermiso(permiso.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            sx={{mt:2}}
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditRole;
