import { useTheme } from "@emotion/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeletePagosMutation,
  useGetAllPagosQuery,
} from "../../services/pagosApi";
import { Box, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../state/reducers/notificacionSlice";
import Header from "../../components/common/Header";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolbar";
import { CustomPagination } from "../../components/common/CustomPagination";
import AlertDialog from "../../components/common/AlertDialog";

const Pagos = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  //const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error, refetch } = useGetAllPagosQuery({
    search,
    page: page + 1,
    limit: pageSize,
  });
  //const [createPago, { isLoading: isCreating }] = useCreatePagoMutation();
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  const [deletePagos, { isLoading: isDeleting }] = useDeletePagosMutation();

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/pagos", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const rows = useMemo(() => {
    return data?.pagos
      ? data?.pagos.map((row) => ({
          id: row.id_pago,
          cliente: row.documento?.cliente?.nombre || "Sin cliente",
          metodo: row.metodo?.nombre || "Sin método",
          monto: row.monto,
          fechaPago: row.fecha,
          referencia: row.referencia || "N/A",
          tipoDocumento: row.documento?.tipo_documento || "Desconocido",
          estadoPago: row.documento?.estadoPago?.nombre || "Sin estado",
        }))
      : [];
  }, [data?.pagos]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.25, resizable: false },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 0.5,
      resizable: false,
    },
    {
      field: "metodo",
      headerName: "Metodo",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "monto",
      headerName: "Monto",
      flex: 0.3,
      resizable: false,
      renderCell: (params) =>
        `$${Number(params.row?.monto || 0).toLocaleString("es-CL")}`,
    },
    {
      field: "fechaPago",
      headerName: "Fecha de Pago",
      flex: 0.5,
      resizable: false,
      renderCell: (params) =>
        format(new Date(params.value), "dd-MM-yyyy", {
          locale: es,
        }),
    },
    {
      field: "referencia",
      headerName: "Referencia",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "estadoPago",
      headerName: "Estado",
      flex: 0.4,
      resizable: false,
    },
    {
      field: "editar",
      headerName: "Editar",
      flex: 0.4,
      sortable: false,
      resizable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          alignItems="center"
          gap={1}
        >
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  // Función para eliminar pagos
  const handleBulkDelete = async () => {
    try {
      setDeleteLoading(true);
      await deletePagos({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Pagos eliminados correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar Pagos: ${error.error}`,
          severity: "error",
        })
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate(`/pagos/editar/${row.id}`, { state: { refetch: true } });
  };
  const handleOpenDelete = () => {
    if (selectedRows.length > 0) {
      setOpenAlert(true);
    } else {
      dispatch(
        showNotification({
          message: "Debe seleccionar al menos un pago.",
          severity: "warning",
        })
      );
    }
  };
  if (isLoading) return <LoaderComponent />;
  if (isError) {
    dispatch(
      showNotification({
        message: `Error al obtener pagos: ${error.error}`,
        severity: "error",
      })
    );
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Pagos" subtitle="Lista de Pagos" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[50],
            borderBottom: "none",
            fontWeight: 600,
            fontSize: "1.2rem",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.secondary[1000],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.grey[300],
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
        }}
      >
        <Button
          color="error"
          variant="contained"
          onClick={handleOpenDelete}
          disabled={selectedRows.length === 0 || deleteLoading}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
        </Button>
        <DataGrid
          loading={isLoading || !data?.pagos}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          paginationMode="server"
          rowCount={paginacion?.totalItems || rows.length}
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          paginationModel={{
            pageSize: pageSize,
            page: page,
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          sx={{
            color: "black",
            fontWeight: 400,
            fontSize: "1rem",
          }}
          pagination
          slots={{
            toolbar: DataGridCustomToolbar,
            pagination: CustomPagination,
          }}
          slotProps={{ toolbar: { searchInput, setSearchInput, setSearch } }}
        />
      </Box>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar los ${selectedRows.length} pagos seleccionados?`}
      />
    </Box>
  );
};

export default Pagos;
