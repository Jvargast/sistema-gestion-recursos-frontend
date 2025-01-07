import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Modal,
  Pagination,
} from "@mui/material";
import { useGetPendingTransaccionesQuery } from "../../services/ventasApi";

const DetallesSelector = ({ open, onClose, onSeleccionar }) => {
  const [search, setSearch] = useState("");
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const { data: transaccionesData, isLoading: loadingTransacciones } =
    useGetPendingTransaccionesQuery();

  // Si los datos de transacciones aún no están cargados, usamos un arreglo vacío
  const transacciones = transaccionesData?.transacciones || [];

  // Filtrar transacciones por nombre del cliente
  const filteredTransacciones = transacciones.filter((t) =>
    t.cliente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransacciones.length / pageSize);

  // Paginación de las transacciones filtradas
  const paginatedTransacciones = filteredTransacciones.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDetalleChange = (detalle, transaccion) => {
    const isSelected = detallesSeleccionados.some(
      (d) => d.id_detalle_transaccion === detalle.id_detalle_transaccion
    );
    if (isSelected) {
      setDetallesSeleccionados((prev) =>
        prev.filter(
          (d) => d.id_detalle_transaccion !== detalle.id_detalle_transaccion
        )
      );
    } else {
      setDetallesSeleccionados((prev) => [
        ...prev,
        { ...detalle, transaccion }, // Incluye la información de la transacción
      ]);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: "600px",
          margin: "50px auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Seleccionar Detalles
        </Typography>
        <TextField
          label="Buscar por cliente"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />
        {loadingTransacciones ? (
          <Typography>Cargando transacciones...</Typography>
        ) : (
          <>
            <Box>
              {paginatedTransacciones.map((transaccion) => (
                <Card key={transaccion.id_transaccion} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">
                      Transacción {transaccion.id_transaccion} - Cliente:{" "}
                      {transaccion.cliente.nombre}
                    </Typography>
                    {transaccion.detalles.map((detalle) => (
                      <FormControlLabel
                        key={detalle.id_detalle_transaccion}
                        control={
                          <Checkbox
                            checked={detallesSeleccionados.some(
                              (d) =>
                                d.id_detalle_transaccion ===
                                detalle.id_detalle_transaccion
                            )}
                            onChange={() =>
                              handleDetalleChange(detalle, transaccion)
                            }
                          />
                        }
                        label={`${detalle.producto.nombre_producto} - Cantidad: ${detalle.cantidad}`}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2, textAlign: "center" }}
            />
          </>
        )}
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSeleccionar(detallesSeleccionados)}
            sx={{ mr: 2 }}
          >
            Confirmar Selección
          </Button>
          <Button variant="text" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetallesSelector;
