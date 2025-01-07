import React, { useEffect, useState } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AsyncSelect from "react-select/async";

const ProductDetailsCamion = ({
  value,
  onChange,
  productos = [],
  setSearchTerm,
}) => {
  const [details, setDetails] = useState(value || []);
  const [total, setTotal] = useState(0);
  const validProductos = Array.isArray(productos)
    ? productos
    : productos.data || [];

  // Actualizar el total cada vez que los detalles cambien
  useEffect(() => {
    const newTotal = details.reduce(
      (sum, detail) => sum + (detail.cantidad || 0) * (detail.precio || 0),
      0
    );
    setTotal(newTotal);
  }, [details]);

  useEffect(() => {
    onChange(details);
  }, [details, onChange]);

  // Agregar un nuevo producto al listado de detalles
  const handleAddProduct = () => {
    const newDetails = [
      ...details,
      {
        id_inventario_camion: "",
        id_producto: "",
        cantidad: "",
        nombre_producto: "",
        precio: 0,
      },
    ];
    setDetails(newDetails);
  };

  // Eliminar un producto del listado
  const handleRemoveProduct = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  // Manejar cambios en un producto específico
  const handleInputChange = (index, field, newValue) => {
    const updatedDetails = [...details];
    const detailToUpdate = updatedDetails[index];

    if (!detailToUpdate) {
      console.error(`No existe un detalle en el índice ${index}`);
      return;
    }

    // Actualizar el valor del campo
    detailToUpdate[field] = newValue;

    setDetails(updatedDetails);

  };

  // Cargar las opciones de productos del camión de forma asincrónica
  const loadProductOptions = async (inputValue) => {
    try {
      setSearchTerm(inputValue); // Actualiza el término de búsqueda en el padre

      // Accede correctamente al array de productos dentro de 'productos.data'
      const options = validProductos.map((product) => ({
        value: String(product.id_inventario_camion),
        label: `${product.nombre_producto} (Disponibles: ${product.cantidad})`,
      }));

      return options;
    } catch (error) {
      console.error("Error cargando las opciones de productos:", error);
      return [];
    }
  };

  return (
    <Box>
      <Typography variant="h6">Detalles de Productos del Camión</Typography>
      {details.map((detail, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
          {/* Selector asincrónico para buscar productos */}
          <Box style={{ flex: 2 }}>
            <AsyncSelect
              placeholder="Buscar producto..."
              cacheOptions
              defaultOptions
              loadOptions={loadProductOptions}
              value={
                detail.id_inventario_camion
                  ? {
                      value: String(detail.id_inventario_camion),
                      label: `${detail.nombre_producto || ""} (Disponibles: ${
                        validProductos.find(
                          (p) =>
                            String(p.id_inventario_camion) ===
                            String(detail.id_inventario_camion)
                        )?.cantidad || 0
                      })`,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                const selectedProduct = validProductos.find(
                  (product) =>
                    String(product.id_inventario_camion) ===
                    selectedOption.value
                );
                if (selectedProduct) {
                  handleInputChange(
                    index,
                    "id_inventario_camion",
                    selectedProduct.id_inventario_camion
                  );
                  handleInputChange(
                    index,
                    "id_producto",
                    selectedProduct.id_producto
                  );
                  handleInputChange(
                    index,
                    "nombre_producto",
                    selectedProduct.nombre_producto
                  );
                  handleInputChange(
                    index,
                    "cantidad",
                    selectedProduct.cantidad
                  );
                  handleInputChange(
                    index,
                    "precio",
                    parseFloat(selectedProduct.precio)
                  ); // Configura el precio del producto
                }
              }}
            />
          </Box>
          {/* Campo para ingresar la cantidad del producto */}
          <TextField
            label="Precio"
            type="number"
            value={detail.precio || ""}
            disabled
            style={{ flex: 1 }}
          />
          <TextField
            label="Cantidad"
            type="number"
            value={detail.cantidad || ""}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              const maxCantidad = validProductos.find(
                (product) =>
                  String(product.id_inventario_camion) ===
                  String(detail.id_inventario_camion)
              )?.cantidad;
              if (newValue <= maxCantidad && newValue >= 0) {
                handleInputChange(index, "cantidad", newValue);
              } else {
                alert(
                  "La cantidad debe estar entre 0 y la cantidad disponible."
                );
              }
            }}
            style={{ flex: 1 }}
          />
          <TextField
            label="Subtotal"
            type="number"
            value={
              detail.cantidad && detail.precio
                ? detail.cantidad * detail.precio
                : 0
            }
            disabled
            style={{ flex: 1 }}
          />
          {/* Botón para eliminar el producto */}
          <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Typography variant="h6">
          Total a pagar: <strong>${total.toLocaleString()}</strong>
        </Typography>
      </Box>
      {/* Botón para agregar un nuevo producto */}
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
      >
        Agregar Producto
      </Button>
    </Box>
  );
};

export default ProductDetailsCamion;
