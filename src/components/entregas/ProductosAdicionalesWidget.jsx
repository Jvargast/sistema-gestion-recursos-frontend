import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const ProductosAdicionalesWidget = ({
  productosAdicionales,
  setProductosAdicionales,
  productos,
  loadingProductos,
}) => {
  const handleAddProductoAdicional = () => {
    setProductosAdicionales((prev) => [
      ...prev,
      { id_producto: "", cantidad: 1 },
    ]);
  };

  const handleRemoveProductoAdicional = (index) => {
    setProductosAdicionales((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductoChange = (index, value) => {
    setProductosAdicionales((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, id_producto: value } : item
      )
    );
  };

  const handleCantidadChange = (index, value) => {
    setProductosAdicionales((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, cantidad: parseInt(value, 10) || 0 } : item
      )
    );
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Productos Adicionales
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {productosAdicionales.map((producto, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Producto</InputLabel>
              <Select
                value={producto.id_producto || ""}
                onChange={(e) => handleProductoChange(index, e.target.value)}
              >
                {loadingProductos ? (
                  <MenuItem disabled>Cargando productos...</MenuItem>
                ) : (
                  productos?.map((prod) => (
                    <MenuItem key={prod.id_producto} value={prod.id_producto}>
                      {prod.nombre_producto}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <TextField
              label="Cantidad"
              type="number"
              value={producto.cantidad || 0}
              onChange={(e) => handleCantidadChange(index, e.target.value)}
              sx={{ width: "100px", mr: 2 }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveProductoAdicional(index)}
            >
              <RemoveCircle />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={handleAddProductoAdicional}
        fullWidth
      >
        Agregar Producto
      </Button>
    </Box>
  );
};

const DetallesSelectorWithProducts = ({
  productosAdicionales,
  setProductosAdicionales,
  productos,
  loadingProductos,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Widget de Productos Adicionales */}
      <Box>
        <ProductosAdicionalesWidget
          productosAdicionales={productosAdicionales}
          setProductosAdicionales={setProductosAdicionales}
          productos={productos}
          loadingProductos={loadingProductos}
        />
      </Box>
    </Box>
  );
};

export default DetallesSelectorWithProducts;

