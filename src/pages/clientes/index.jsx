import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import Header from "../../components/common/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  useDeleteClientesMutation,
  useGetAllClientesQuery,
} from "../../services/clientesApi";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CustomNewButton from "../../components/common/CustomNewButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolbar";
import { CustomPagination } from "../../components/common/CustomPagination";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { showNotification } from "../../state/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";
import LoaderComponent from "../../components/common/LoaderComponent";

const Clientes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openAlert, setOpenAlert] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, isError, error, refetch } = useGetAllClientesQuery({
    search,
    page: page + 1,
    limit: pageSize,
  });
  const [deleteClientes, { isLoading: isDeleting }] =
    useDeleteClientesMutation();
  //const [sort, setSort] = useState({});
  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  const rows = useMemo(() => {
    return data?.clientes
      ? data?.clientes.map((row) => ({
          ...row,
          id: row.rut,
        }))
      : [];
  }, [data?.clientes]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/clientes", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const columns = [
    {
      field: "sequentialId",
      headerName: "Id",
      flex: 0.25,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.6,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 0.5,
    },
    {
      field: "tipo_cliente",
      headerName: "Empresa/Persona",
      flex: 0.4,
    },
    {
      field: "activo",
      headerName: "Activo",
      flex: 0.3,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Punto de color */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: params.value ? "green" : "red",
            }}
          ></div>
          {/* Texto */}
          <span>{params.value ? "Activo" : "Inactivo"}</span>
        </div>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="space-evenly"
          width="100%"
          alignItems="center"
          gap={1}
        >
          <IconButton color="success" onClick={() => handleView(params.row)}>
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditRoundedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleBulkDelete = async () => {
    try {
      /* setDeleteLoading(true); */
      await deleteClientes({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Clientes eliminados correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar clientes: ${error.error}`,
          severity: "error",
        })
      );
    } /* finally {
      setDeleteLoading(false);
    } */
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    navigate(`/clientes/editar/${row.rut}`, { state: { refetch: true } });
  };

  // Función para manejar la acción de eliminar
  const handleView = (row) => {
    navigate(`/clientes/ver/${row.rut}`, { state: { refetch: true } });
  };

  const handleOpenDelete = () => {
    if (selectedRows.length > 0) {
      setOpenAlert(true);
    } else {
      dispatch(
        showNotification({
          message: "Debe seleccionar al menos un cliente.",
          severity: "warning",
        })
      );
    }
  };

  const rowsPerPageOptions = [5, 10, 25, 50];

  if (isLoading) return <LoaderComponent />;
  if (isError) {
    dispatch(
      showNotification({
        message: `Error al obtener clientes: ${error.error}`,
        severity: "error",
      })
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Clientes" subtitle="Lista de Clientes" />
      <Box
        mt="40px"
        height="75vh"
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
          disabled={selectedRows.length === 0 || isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
        </Button>
        <CustomNewButton
          name={"Nuevo Cliente"}
          onClick={() => navigate("/clientes/crear")}
        />
        <DataGrid
          loading={isLoading || !data?.clientes}
          getRowId={(row) => row.rut}
          rows={rows}
          columns={columns}
          paginationMode="server"
          rowCount={paginacion?.totalItems || rows.length}
          paginationModel={{
            pageSize: pageSize,
            page: page,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          pageSizeOptions={rowsPerPageOptions}
          sx={{
            color: "black",
            fontWeight: 400,
            fontSize: "1rem",
          }}
          slots={{
            toolbar: DataGridCustomToolbar,
            pagination: CustomPagination,
          }}
          slotProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar los ${selectedRows.length} clientes seleccionados?`}
      />
    </Box>
  );
};

export default Clientes;
