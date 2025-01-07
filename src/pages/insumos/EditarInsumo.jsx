import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetProductoByIdQuery,
  useUpdateProductoMutation,
} from "../../services/inventarioApi";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import { useGetAllCategoriasQuery } from "../../services/categoriaApi";


const EditarInsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data, isLoading, isError, refetch } = useGetProductoByIdQuery(id);
  const [updateProducto, { isLoading: isUpdating }] = useUpdateProductoMutation();
  const { data: categorias, isLoading: isLoadingCategorias, isError: isErrorCategorias } = useGetAllCategoriasQuery();

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    if (data) {
      setFormData({
        nombre_producto: data.nombre_producto,
        marca: data.marca,
        codigo_barra: data.codigo_barra,
        precio: data.precio,
        descripcion: data.descripcion,
        id_categoria: data.id_categoria,
        id_estado_producto: data.id_estado_producto,
        stock: data.inventario?.cantidad || 0,
        image_url: data.image_url || "https://via.placeholder.com/150",
        id_tipo_producto: 2, // Forzamos a Insumo
      });
      setImagePreview(data.image_url || "https://via.placeholder.com/150");
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/insumos/editar/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "image_url") {
      setImagePreview(value || "https://via.placeholder.com/150");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProducto({ id, ...formData }).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Insumo actualizado correctamente.",
          severity: "success",
        })
      );
      navigate("/insumos", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar insumo: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Error al cargar el insumo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="max-w-7xl mx-auto py-10 px-6 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Imagen del Insumo */}
      <Box className="lg:col-span-1 flex justify-center items-center">
        <Box className="w-full h-96 bg-gray-100 shadow-md rounded-lg flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Vista Previa"
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </Box>
      </Box>

      {/* Formulario del Insumo */}
      <Box className="lg:col-span-2">
        <Typography
          variant="h3"
          className="text-gray-800 font-bold text-left mb-6 text-3xl"
        >
          Editar Insumo
        </Typography>

        <Divider className="mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Sección de Información General */}
          <Typography variant="h5" className="text-gray-700 font-semibold col-span-full">
            Información General
          </Typography>
          <TextField
            label="Nombre del Insumo"
            name="nombre_producto"
            value={formData.nombre_producto || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Marca"
            name="marca"
            value={formData.marca || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Código de Barra"
            name="codigo_barra"
            value={formData.codigo_barra || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />

          {/* Sección de Detalles */}
          <Typography variant="h5" className="text-gray-700 font-semibold col-span-full">
            Detalles del Insumo
          </Typography>
          <TextField
            label="Precio"
            name="precio"
            value={formData.precio || ""}
            onChange={handleChange}
            fullWidth
            type="number"
            required
          />
          <TextField
            label="Stock Disponible"
            name="stock"
            value={formData.stock || ""}
            onChange={handleChange}
            fullWidth
            type="number"
            required
          />
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="id_categoria"
              value={formData.id_categoria || ""}
              onChange={handleChange}
            >
             
              {categorias?.map((categoria) => (
              <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre_categoria}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="id_estado_producto"
              value={formData.id_estado_producto || ""}
              onChange={handleChange}
            >
              <MenuItem value={1}>Disponible</MenuItem>
              <MenuItem value={2}>En Tránsito</MenuItem>
            </Select>
          </FormControl>

          {/* URL de Imagen */}
          <Typography variant="h5" className="text-gray-700 font-semibold col-span-full">
            Imagen del Insumo
          </Typography>
          <TextField
            label="URL de la Imagen"
            name="image_url"
            value={formData.image_url || ""}
            onChange={handleChange}
            fullWidth
          />

          {/* Botones */}
          <Box className="flex justify-end col-span-full space-x-4 mt-4">
            <Button variant="outlined" onClick={() => navigate("/insumos")}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditarInsumo;
