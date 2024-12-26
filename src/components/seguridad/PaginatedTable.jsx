import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import LoaderComponent from "../common/LoaderComponent";


const PaginatedTable = ({
  title,
  data,
  isLoading,
  onPageChange,
  paginacion,
  columns,
}) => {
  const currentPage = (paginacion?.currentPage || 1) - 1; // Convertir a índice basado en 0
  const totalItems = paginacion?.totalItems || 0;
  const rowsPerPage = paginacion?.pageSize || 5;

  const rowsPerPageOptions = [5, 10, 25, 50];
  if (!rowsPerPageOptions.includes(rowsPerPage)) {
    rowsPerPageOptions.push(rowsPerPage);
  }

  // Manejar cambios de página
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage, rowsPerPage);
  };

  // Manejar cambios en el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onPageChange(0, newRowsPerPage);
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div>
      <Typography variant="h5" className="font-bold mb-4 text-gray-800">
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  style={{ width: column.width || "auto", minWidth: column.minWidth || "auto" }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                className="hover:bg-gray-50 transition duration-200"
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.renderCell
                      ? column.renderCell({ value: row[column.field], row })
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </div>
  );
};

export default PaginatedTable;
