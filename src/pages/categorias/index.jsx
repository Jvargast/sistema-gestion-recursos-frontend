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
  useCreateCategoriaMutation,
  useDeleteCategoriaMutation,
  useGetAllCategoriasQuery,
} from "../../services/categoriaApi";
import BackButton from "../../components/common/BackButton";
import { showNotification } from "../../state/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import AlertDialog from "../../components/common/AlertDialog";
import ModalForm from "../../components/common/ModalForm";

const CategoriaManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createCategoria, { isLoading: isCreating }] =
    useCreateCategoriaMutation();
  const [deleteCategoria, { isLoading: isDeleting }] =
    useDeleteCategoriaMutation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);

  const {
    data: categorias,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategoriasQuery();

  const handleSubmit = async (data) => {
    try {
      await createCategoria({
        ...data,
      }).unwrap();

      dispatch(
        showNotification({
          message: "Categoría creada correctamente",
          severity: "success",
        })
      );
      setOpen(false);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al crear la categoría: " + error.data?.error,
          severity: "error",
        })
      );
    }
  };

  const confirmDeleteCategoria = (id) => {
    setSelectedCategoriaId(id);
    setOpenAlert(true);
  };

  const handleDeleteCategoria = async () => {
    try {
      await deleteCategoria(selectedCategoriaId).unwrap();
      dispatch(
        showNotification({
          message: "Categoría eliminada correctamente",
          severity: "success",
          duration: 3000,
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al eliminar la categoría: " + error.data?.error,
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/categorias", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading) return <LoaderComponent />;

  if (isError)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar las categorías
        </Typography>
      </Box>
    );

  const fields = [
    {
      name: "nombre_categoria",
      label: "Nombre Categoría",
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripción Categoría",
      type: "text",
    },
  ];

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <BackButton to="/" label="Volver al menú" />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="font-bold text-gray-800">
          Gestión de Categorías
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-lg"
          disabled={isCreating}
        >
          Añadir Categoría
        </Button>
      </Box>

      <Grid2 container spacing={4} className="text-lg">
        {categorias?.map((categoria) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={categoria.id_categoria}>
            <Card className="shadow-lg hover:shadow-xl transition text-lg">
              <CardContent>
                <Typography
                  variant="h5"
                  className="font-semibold text-gray-700 capitalize"
                >
                  {categoria.nombre_categoria}
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-2">
                  {categoria.descripcion}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-4"
                >
                  ID: {categoria.id_categoria}
                </Typography>
              </CardContent>
              <CardActions className="flex justify-between">
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() =>
                    navigate(`/categorias/editar/${categoria.id_categoria}`)
                  }
                  className="text-lg"
                >
                  Editar Categoría
                </Button>
                <Button
                  size="medium"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => confirmDeleteCategoria(categoria.id_categoria)}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
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
        title={"Crear Categoría"}
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteCategoria}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default CategoriaManagement;
