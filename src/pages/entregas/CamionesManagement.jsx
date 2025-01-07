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
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateCamionMutation,
  useDeleteCamionMutation,
  useGetAllCamionesQuery,
} from "../../services/camionesApi";
import { showNotification } from "../../state/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import LoaderComponent from "../../components/common/LoaderComponent";

const CamionesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createCamion, { isLoading: isCreating }] = useCreateCamionMutation();
  const [deleteCamion, { isLoading: isDeleting }] = useDeleteCamionMutation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCamionId, setSelectedCamionId] = useState(null);

  const {
    data: camiones,
    isLoading,
    isError,
    refetch,
  } = useGetAllCamionesQuery();

  const handleSubmit = async (data) => {
    try {
      await createCamion({
        ...data,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Camión creado correctamente",
          severity: "success",
        })
      );
      setOpen(false);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al crear el camión: " + error.data?.error,
          severity: "error",
        })
      );
    }
  };

  const confirmDeleteCamion = (id) => {
    setSelectedCamionId(id);
    setOpenAlert(true);
  };

  const handleDeleteCamion = async () => {
    try {
      await deleteCamion(selectedCamionId).unwrap();
      dispatch(
        showNotification({
          message: "Camión eliminado correctamente",
          severity: "success",
          duration: 3000,
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al eliminar el camión: " + error.data?.error,
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/camiones", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading) return <LoaderComponent />;

  if (isError)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar los camiones
        </Typography>
      </Box>
    );

  const fields = [
    {
      name: "placa",
      label: "Placa del Camión",
      type: "text",
    },
    {
      name: "capacidad",
      label: "Capacidad del Camión",
      type: "number",
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Disponible", value: "Disponible" },
        { label: "En Ruta", value: "En Ruta" },
        { label: "Mantenimiento", value: "Mantenimiento" },
      ],
    },
  ];

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <BackButton to="/" label="Volver al menú" />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="font-bold text-gray-800">
          Gestión de Camiones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-lg"
          disabled={isCreating}
        >
          Añadir Camión
        </Button>
      </Box>

      <Grid2 container spacing={4} className="text-lg">
        {camiones?.map((camion) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={camion.id_camion}>
            <Card className="shadow-lg hover:shadow-xl transition text-lg">
              <CardContent>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-4"
                >
                  ID: {camion.id_camion}
                </Typography>
                <Typography
                  variant="h5"
                  className="font-semibold text-gray-700 capitalize"
                >
                  Patente: {camion.placa}
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-2">
                  Capacidad: {camion.capacidad}
                </Typography>

                <Typography
                  variant="h5"
                  className="font-semibold text-gray-700 capitalize"
                >
                  Estado: {camion.estado}
                </Typography>
              </CardContent>
              <CardActions className="flex justify-between">
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() =>
                    navigate(`/camiones/editar/${camion.id_camion}`)
                  }
                  className="text-lg"
                >
                  Editar Camión
                </Button>
                <Button
                  size="medium"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => confirmDeleteCamion(camion.id_camion)}
                >
                  {isDeleting ? "Eliminadno..." : "Eliminar"}
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title={"Crear Camión"}
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteCamion}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este camión? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default CamionesManagement;
