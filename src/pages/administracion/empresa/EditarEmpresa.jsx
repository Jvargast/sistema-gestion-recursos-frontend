import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import {
  useGetAllSucursalsQuery,
  useGetEmpresaByIdQuery,
  useUpdateEmpresaMutation,
  useUpdateSucursalMutation,
} from "../../../services/empresaApi";
import BackButton from "../../../components/common/BackButton";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";

const EditarEmpresa = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: empresa, isLoading: isLoadingEmpresa, refetch: refetchEmpresa } =
    useGetEmpresaByIdQuery(id);
  const { data: sucursales, isLoading: isLoadingSucursales, refetchSucursales } =
    useGetAllSucursalsQuery();
  const [updateEmpresa] = useUpdateEmpresaMutation();
  const [updateSucursal] = useUpdateSucursalMutation();

  const [empresaData, setEmpresaData] = useState({});
  const [sucursalData, setSucursalData] = useState({});

  // Sync empresa data with local state
  useEffect(() => {
    if (empresa) {
      setEmpresaData(empresa);
    }
  }, [empresa]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSucursalChange = (id, field, value) => {
    setSucursalData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdateEmpresa = async () => {
    try {
      await updateEmpresa({ id, ...empresaData });
      dispatch(
        showNotification({
          message: "Empresa actualizada correctamente",
          severity: "success",
        })
      );
      refetchEmpresa();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al actualizar empresa",
          severity: "error",
        })
      );
    }
  };

  const handleUpdateSucursal = async (sucursalId) => {
    try {
      await updateSucursal({ id: sucursalId, ...sucursalData[sucursalId] });
      dispatch(
        showNotification({
          message: "Sucursal actualizada correctamente",
          severity: "success",
        })
      );
      refetchSucursales();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al actualizar sucursal",
          severity: "error",
        })
      );
    }
  };

  if (isLoadingEmpresa || isLoadingSucursales) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5">Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Box className="max-w-5xl mx-auto">
        {/* Editar Empresa */}
        <BackButton to="/empresa" label="Volver " />
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="font-bold text-gray-800 mb-4">
              Editar Empresa
            </Typography>
            <Divider className="mb-4" />
            <Grid2 container spacing={4}>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={empresaData.nombre || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  name="rut_empresa"
                  value={empresaData.rut_empresa || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={empresaData.direccion || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={empresaData.telefono || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={empresaData.email || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} className="flex justify-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateEmpresa}
                >
                  Guardar Cambios Empresa
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Editar Sucursales */}
        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
          Editar Sucursales
        </Typography>
        <Divider className="mb-4" />
        <Grid2 container spacing={4}>
          {sucursales
            ?.filter((sucursal) => sucursal.id_empresa === parseInt(id))
            .map((sucursal) => (
              <Grid2 xs={12} key={sucursal.id_sucursal}>
                <Card className="shadow-lg">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-700 mb-2"
                    >
                      {sucursal.nombre}
                    </Typography>
                    <Grid2 container spacing={4}>
                      <Grid2 xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nombre"
                          value={
                            sucursalData[sucursal.id_sucursal]?.nombre ||
                            sucursal.nombre
                          }
                          onChange={(e) =>
                            handleSucursalChange(
                              sucursal.id_sucursal,
                              "nombre",
                              e.target.value
                            )
                          }
                          variant="outlined"
                        />
                      </Grid2>
                      <Grid2 xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Dirección"
                          value={
                            sucursalData[sucursal.id_sucursal]?.direccion ||
                            sucursal.direccion
                          }
                          onChange={(e) =>
                            handleSucursalChange(
                              sucursal.id_sucursal,
                              "direccion",
                              e.target.value
                            )
                          }
                          variant="outlined"
                        />
                      </Grid2>
                      <Grid2 xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          value={
                            sucursalData[sucursal.id_sucursal]?.telefono ||
                            sucursal.telefono
                          }
                          onChange={(e) =>
                            handleSucursalChange(
                              sucursal.id_sucursal,
                              "telefono",
                              e.target.value
                            )
                          }
                          variant="outlined"
                        />
                      </Grid2>
                      <Grid2 xs={12} className="flex justify-end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleUpdateSucursal(sucursal.id_sucursal)
                          }
                        >
                          Guardar Cambios Sucursal
                        </Button>
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default EditarEmpresa;
