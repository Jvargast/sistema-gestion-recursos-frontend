import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add, Delete, ArrowBack, ArrowForward } from "@mui/icons-material";

const Productos = () => {
  // Datos simulados para la tabla
  const rows = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      stock: 100,
      name: "Bidón 20 litros",
      barcode: "0799192412240",
      brand: "Propia",
      category: "Agua",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      stock: 20000,
      name: "Hielo 850 grs",
      barcode: "0799192412257",
      brand: "Propia",
      category: "Hielo",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/50",
      stock: 20000,
      name: "Hielo 2kg",
      barcode: "0799192412264",
      brand: "Propia",
      category: "Hielo",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/50",
      stock: 20000,
      name: "Hielo 2kg",
      barcode: "XXXXXXXXXXXXXX",
      brand: "Dali",
      category: "Agua",
    },
  ];

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f9fafb", height: "100%" }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Imagen</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Stock Disponible</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Código de Barra</TableCell>
              <TableCell align="center">Marca</TableCell>
              <TableCell align="center">Categoría</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">
                  <img
                    src={row.image}
                    alt={row.name}
                    style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.stock}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.barcode}</TableCell>
                <TableCell align="center">{row.brand}</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botones de navegación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "1rem",
          gap: "1rem",
        }}
      >
        <IconButton color="primary">
          <ArrowBack />
        </IconButton>
        <IconButton color="primary">
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Productos;
