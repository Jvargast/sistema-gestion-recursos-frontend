import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import AsyncSelect from "react-select/async";
import { DeleteOutline } from "@mui/icons-material";
import { useDeleteDetalleMutation } from "../../../services/ventasApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../state/reducers/notificacionSlice";

const DetalleTransaccion = ({
  detallesIniciales,
  productos,
  onDetallesChange,
  setSearchTerm,
  idTransaccion,
}) => {
  const dispatch = useDispatch();
  const [detalles, setDetalles] = useState([]);
  const [deleteDetalle] = useDeleteDetalleMutation();
  useEffect(() => {
    // Inicializar los detalles con propiedades predeterminadas
    const detallesInicializados =
      detallesIniciales?.map((detalle) => ({
        id_detalle_transaccion: detalle.id_detalle_transaccion,
        id_producto: detalle.id_producto,
        producto: detalle.producto || {},
        cantidad: detalle.cantidad || 0,
        precio_unitario: detalle.precio_unitario || 0,
        subtotal: (detalle.cantidad || 0) * (detalle.precio_unitario || 0),
        estado_producto_transaccion: detalle.estado_producto_transaccion,
        estado: detalle.estado || {},
      })) || [];
    setDetalles(detallesInicializados);
  }, [detallesIniciales]);

  const handleDetalleChange = (index, field, value) => {
    setDetalles((prevDetalles) => {
      const updatedDetalles = [...prevDetalles];
      const detalle = updatedDetalles[index];

      if (!detalle) {
        dispatch(
          showNotification({
            message: "Detalle no encontrado correctamente",
            severity: "warning",
          })
        );
        return prevDetalles;
      }

      detalle[field] = value;
      // Recalcular subtotal si el campo modificado es cantidad o precio_unitario
      if (field === "cantidad" || field === "precio_unitario") {
        detalle.subtotal =
          (detalle.cantidad || 0) * (detalle.precio_unitario || 0);
      }

      onDetallesChange(updatedDetalles);
      return updatedDetalles;
    });
  };

  const handleAddDetalle = (
    id,
    producto,
    estado_producto_transaccion,
    estado
  ) => {
    if (!producto) {
      dispatch(
        showNotification({
          message: "Producto no seleccionado correctamente",
          severity: "warning",
        })
      );
      return;
    }

    const newDetalle = {
      id_detalle_transaccion: id,
      id_producto: producto.id_producto,
      producto: producto,
      cantidad: 1,
      precio_unitario: parseFloat(producto.precio) || 0,
      subtotal: parseFloat(producto.precio) || 0,
      estado_producto_transaccion: estado_producto_transaccion || null,
      estado: estado || { nombre_estado: "Sin estado asignado" },
    };

    setDetalles((prevDetalles) => {
      const updatedDetalles = [...prevDetalles, newDetalle];
      onDetallesChange(updatedDetalles);
      return updatedDetalles;
    });

    dispatch(
      showNotification({
        message: "Detalle agregado correctamente",
        severity: "success",
      })
    );
  };

  const handleRemoveDetalle = async (index) => {
    const detalle = detalles[index];
    if (!detalle) {
      dispatch(
        showNotification({
          message: "El detalle no tiene un id_detalle_transaccion válido",
          severity: "error",
        })
      );
      return;
    }
    if (!detalle.id_detalle_transaccion) {
      // Si no tiene id_detalle_transaccion, eliminamos directamente de la lista local
      setDetalles((prevDetalles) => {
        const updatedDetalles = prevDetalles.filter((_, i) => i !== index);
        onDetallesChange(updatedDetalles);
        return updatedDetalles;
      });
      dispatch(
        showNotification({
          message: "Detalle eliminado localmente",
          severity: "info",
        })
      );
      return;
    }

    try {
      // Eliminar el detalle en el backend
      await deleteDetalle({
        id: idTransaccion, // Transacción asociada
        idDetalle: detalle.id_detalle_transaccion, // ID del detalle
      }).unwrap();

      // Actualizar el estado local eliminando el detalle
      const updatedDetalles = detalles.filter((_, i) => i !== index);
      setDetalles(updatedDetalles);
      onDetallesChange(updatedDetalles);

      dispatch(
        showNotification({
          message: "Detalle eliminado correctamente",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al eliminar el detalle:", error);
      dispatch(
        showNotification({
          message: "No se pudo eliminar el detalle",
          severity: "error",
        })
      );
    }
  };

  const loadProductOptions = async (inputValue) => {
    setSearchTerm(inputValue);
    return productos.map((product) => ({
      value: product.id_producto,
      label: product.nombre_producto,
    }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detalles de Productos
      </Typography>

      {detalles.map((detalle, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
          <TextField
            label="Producto"
            value={detalle.producto?.nombre_producto || ""}
            disabled
            style={{ flex: 2 }}
          />
          <TextField
            label="Estado Producto"
            value={detalle.producto?.estado?.nombre_estado || "N/A"}
            disabled
            style={{ flex: 1 }}
          />
          <TextField
            label="Estado Detalle"
            value={
              detalle.estado && detalle.estado.nombre_estado
                ? detalle.estado.nombre_estado
                : "N/A"
            }
            style={{ flex: 1 }}
          />
          <TextField
            label="Cantidad"
            type="number"
            value={detalle.cantidad || 0}
            onChange={(e) =>
              handleDetalleChange(index, "cantidad", Number(e.target.value))
            }
            style={{ flex: 1 }}
          />
          <TextField
            label="Precio Unitario"
            type="number"
            value={detalle.precio_unitario || 0}
            onChange={(e) =>
              handleDetalleChange(
                index,
                "precio_unitario",
                Number(e.target.value)
              )
            }
            style={{ flex: 1 }}
          />
          <TextField
            label="Subtotal"
            value={detalle.subtotal || 0}
            disabled
            style={{ flex: 1 }}
          />
          <IconButton color="error" onClick={() => handleRemoveDetalle(index)}>
            <DeleteOutline />
          </IconButton>
        </Box>
      ))}

      <AsyncSelect
        placeholder="Buscar producto..."
        cacheOptions
        defaultOptions
        loadOptions={loadProductOptions}
        onChange={(selectedOption) => {
          const selectedProduct = productos.find(
            (product) => product.id_producto === selectedOption.value
          );
          handleAddDetalle(
            detalles.id_detalle_transaccion,
            selectedProduct,
            detalles.estado_producto_transaccion,
            detalles?.estado?.nombre_estado
          );
        }}
        styles={{ marginBottom: "16px" }}
      />

      <Box mt={2}>
        <Typography variant="h6">
          Total: {detalles.reduce((acc, item) => acc + (item.subtotal || 0), 0)}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetalleTransaccion;
