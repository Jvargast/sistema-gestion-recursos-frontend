import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Button,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
} from "../../../services/empresaApi";
import BackButton from "../../../components/common/BackButton";

const Empresa = () => {
  const {
    data: empresas,
    isLoading: isLoadingEmpresas,
    isError: isErrorEmpresas,refetch: refetchEmpresas
  } = useGetAllEmpresasQuery();
  const {
    data: sucursales,
    isLoading: isLoadingSucursales,
    isError: isErrorSucursales, refetch: refetchSucursales
  } = useGetAllSucursalsQuery();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refetch) {
      refetchEmpresas();
      refetchSucursales();
      navigate("/empresa", { replace: true });
    }
  }, [location.state, navigate, refetchEmpresas, refetchSucursales]);

  if (isLoadingEmpresas || isLoadingSucursales) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5">Cargando datos...</Typography>
      </Box>
    );
  }

  if (isErrorEmpresas || isErrorSucursales) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar los datos
        </Typography>
      </Box>
    );
  }

  const empresa = empresas?.[0]; // Asumiendo que solo hay una empresa para este perfil

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Box className="max-w-4xl mx-auto">
        {/* Perfil de la Empresa */}
        <BackButton to="/admin" label="Volver al menú" />
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Grid2 container spacing={4} alignItems="center">
              <Grid2 xs={12} md={4} className="flex justify-center">
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "primary.main" }}
                  className="text-4xl font-bold"
                >
                  {empresa?.nombre?.[0]}
                </Avatar>
              </Grid2>
              <Grid2 xs={12} md={8}>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {empresa?.nombre}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  RUT: {empresa?.rut_empresa}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  Dirección: {empresa?.direccion}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  Teléfono: {empresa?.telefono}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  Email: {empresa?.email}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  onClick={() =>
                    navigate(`/empresa/editar/${empresa?.id_empresa}`)
                  }
                >
                  Edición Perfil Empresa
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Lista de Sucursales */}
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
          Sucursales
        </Typography>
        <Grid2 container spacing={4}>
          {sucursales
            ?.filter((sucursal) => sucursal.id_empresa === empresa?.id_empresa)
            .map((sucursal) => (
              <Grid2 xs={12} sm={6} key={sucursal.id_sucursal}>
                <Card className="shadow-lg hover:shadow-xl transition">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-700"
                    >
                      {sucursal.nombre}
                    </Typography>
                    <Divider className="my-2" />
                    <List disablePadding>
                      <ListItem>
                        <ListItemText
                          primary="Dirección"
                          secondary={sucursal.direccion}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Teléfono"
                          secondary={sucursal.telefono}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Empresa;
