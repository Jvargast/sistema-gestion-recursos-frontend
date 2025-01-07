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
  CircularProgress,
  Grid2,
  Divider,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetProductoByIdQuery,
  useUpdateProductoMutation,
} from "../../services/inventarioApi";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import "tailwindcss/tailwind.css";
import { useGetAllCategoriasQuery } from "../../services/categoriaApi";


const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data, isLoading, isError, refetch } = useGetProductoByIdQuery(id);
  const { data: categorias, isLoading: isLoadingCategorias } = useGetAllCategoriasQuery();

  const categoriaOptions = categorias
  ? categorias.map((categoria) => ({
      value: categoria.id_categoria,
      label: categoria.nombre_categoria,
    }))
  : [];


  const [updateProducto, { isLoading: isUpdating }] =
    useUpdateProductoMutation();

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/150"
  );

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
        id_tipo_producto: data.id_tipo_producto,
        stock: data.inventario?.cantidad || 0,
        image_url: data.image_url || "https://via.placeholder.com/150",
      });
      setImagePreview(data.image_url || "https://via.placeholder.com/150");
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/productos/editar/${id}`, { replace: true }); // Limpia el estado
    } else {
      refetch(); // Siempre refresca al cargar
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
      await refetch();
      dispatch(
        showNotification({
          message: "Producto actualizado correctamente.",
          severity: "success",
        })
      );
      navigate("/productos", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar producto: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  const renderTextField = (
    label,
    name,
    type = "text",
    multiline = false,
    rows = 1
  ) => (
    <div className="w-full">
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        multiline={multiline}
        rows={rows}
        required
        variant="outlined"
        className="bg-white shadow-md rounded-lg text-lg"
      />
    </div>
  );

  const renderSelectField = (label, name, options) => (
    <div className="w-full">
      <FormControl
        fullWidth
        variant="outlined"
        className="bg-white shadow-md rounded-lg text-lg"
      >
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          required
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

  if (isLoading || isLoadingCategorias) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error al cargar el producto.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Imagen del Producto */}
      <div className="lg:col-span-1 flex justify-center items-center">
        <div className="w-full h-96 bg-gray-100 shadow-md rounded-lg flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Vista Previa"
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Formulario del Producto */}
      <div className="lg:col-span-2">
        <Typography
          variant="h3"
          className="text-gray-800 font-bold text-left mb-6 text-3xl"
        >
          Editar Producto
        </Typography>

        <Divider className="mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Sección de Información General */}
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Información General
          </Typography>
          {renderTextField("Nombre del Producto", "nombre_producto")}
          {renderTextField("Marca", "marca")}
          {renderTextField("Código de Barra", "codigo_barra")}
          {renderTextField("Descripción", "descripcion", "text", true, 4)}

          {/* Sección de Detalles */}
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Detalles del Producto
          </Typography>
          {renderTextField("Precio", "precio", "number")}
          {renderTextField("Stock Disponible", "stock", "number")}
          {renderSelectField("Categoría", "id_categoria",categoriaOptions)}
          {renderSelectField("Estado", "id_estado_producto", [
            { value: 1, label: "Disponible - Bodega" },
            { value: 2, label: "En tránsito" },
          ])}
          {/* Sección de Imagen */}
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Imagen del Producto
          </Typography>
          <div className="w-full col-span-full">
            <TextField
              fullWidth
              label="URL de la Imagen"
              name="image_url"
              value={formData.image_url || ""}
              onChange={handleChange}
              variant="outlined"
              className="bg-white shadow-md rounded-lg text-lg"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end col-span-full space-x-4 mt-4">
            <Button
              variant="outlined"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={() => navigate("/productos")}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditarProducto;
