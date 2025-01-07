import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";

const AgendaDetails = ({ agenda }) => {
  if (!agenda) {
    return (
      <Typography variant="h6" color="error" className="text-center mt-6">
        No se encontraron datos para la agenda.
      </Typography>
    );
  }

  const renderTable = (title, headers, rows, rowKey, getRowData) => (
    <Box className="mb-6">
      <Typography variant="h6" className="font-semibold mb-2">
        {title}
      </Typography>
      {rows && rows.length > 0 ? (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row[rowKey]}>
                  {getRowData(row).map((cell, index) => (
                    <TableCell key={index}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" className="mt-2 text-gray-500">
          No hay {title.toLowerCase()} en esta agenda.
        </Typography>
      )}
    </Box>
  );

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" className="mb-4 font-bold">
        Detalles de la Agenda de Carga
      </Typography>

      {/* Información general */}
      <Box className="mb-6">
        <Typography variant="h6" className="font-semibold">
          Información General
        </Typography>
        <Typography variant="body1" className="mt-2">
          <strong>Fecha y Hora:</strong> {new Date(agenda.fechaHora).toLocaleString("es-CL")}
        </Typography>
        <Typography variant="body1">
          <strong>Chofer:</strong> {agenda.usuario?.nombre} ({agenda.usuario?.rut})
        </Typography>
        <Typography variant="body1">
          <strong>Camión:</strong> {agenda.camion?.placa || "No asignado"}
        </Typography>
      </Box>

      <Divider className="my-4" />

      {/* Detalles de transacciones */}
      {renderTable(
        "Detalles de Transacciones",
        ["ID Detalle", "Producto", "Cantidad", "Estado"],
        agenda.detalles,
        "id_detalle",
        (detalle) => [
          detalle.id_detalle,
          detalle.producto?.nombre,
          detalle.cantidad,
          detalle.estado_producto_transaccion,
        ]
      )}

      <Divider className="my-4" />

      {/* Productos adicionales */}
      {renderTable(
        "Productos Adicionales",
        ["Producto", "Cantidad"],
        agenda.productosAdicionales,
        "id_producto",
        (producto) => [producto.nombre, producto.cantidad]
      )}
    </Box>
  );
};

export default AgendaDetails;
