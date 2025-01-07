import React, { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useCreateProductoMutation,
  useDeleteProductosMutation,
  useGetAllProductosQuery,
} from "../../services/inventarioApi";
import { useGetAllCategoriasQuery } from "../../services/categoriaApi";
import { useGetAllEstadosQuery } from "../../services/estadoProductoApi";
import { DataGrid } from "@mui/x-data-grid";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import LoaderComponent from "../../components/common/LoaderComponent";
import Header from "../../components/common/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../state/reducers/notificacionSlice";
import { CustomPagination } from "../../components/common/CustomPagination";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolbar";

const Productos = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // values to be sent to the backend

  const [sort, setSort] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* const { data, isLoading } = useGetAllProductosQuery({
    tipo_producto: "Producto_Terminado",
    search,
  }); */
  const { data, isLoading, isError, refetch } = useGetAllProductosQuery({
    tipo_producto: "Producto_Terminado",
    search,
    page: page + 1,
    limit: pageSize,
  });

  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  const {
    data: categorias,
    loadingCategorias,
    error,
  } = useGetAllCategoriasQuery();

  const {
    data: estados,
    loadingEstados,
    isError: errorEstados,
  } = useGetAllEstadosQuery();

  const [createProducto] = useCreateProductoMutation();
  const [deleteProductos, {isLoading: isDeleting}] = useDeleteProductosMutation();

  // Selección de filas
  const [selectedRows, setSelectedRows] = useState([]);

  // Modal agregar productos
  const [open, setOpen] = useState(false);
  // Dialog Alert
  const [openAlert, setOpenAlert] = useState(false);

  // Arreglo de datos
  const rows = data?.productos
    ? data?.productos.map((row) => ({
        ...row,
        categoriaNombre: row.categoria?.nombre_categoria || "Sin categorias",
        inventarioNombre: row.inventario?.cantidad || "Sin inventario",
        estadoNombre: row.estado?.nombre_estado || "Sin estado",
        id: row.id_producto,
      }))
    : [];

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/productos", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  // Definir las columnas del DataGrid
  const columns = [
    {
      field: "image_url",
      headerName: "Imagen",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value || "https://via.placeholder.com/50"}
          alt="Producto"
          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
        />
      ),
    },
    { field: "sequentialId", headerName: "ID", flex: 0.25 },
    { field: "inventarioNombre", headerName: "Stock", flex: 0.315 },
    { field: "nombre_producto", headerName: "Nombre", flex: 0.5 },
    { field: "codigo_barra", headerName: "Código de Barra", flex: 0.5 },
    { field: "marca", headerName: "Marca", flex: 0.3 },
    { field: "categoriaNombre", headerName: "Categoría", flex: 0.4 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
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

  const fields = [
    { name: "nombre_producto", label: "Nombre del Producto", type: "text" },
    { name: "marca", label: "Marca", type: "text" },
    { name: "codigo_barra", label: "Código de Barra", type: "text" },
    { name: "precio", label: "Precio", type: "text" },
    { name: "cantidad_inicial", label: "Cantidad", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text" },
    {
      name: "id_categoria",
      label: "Categoría",
      type: "select",
      options: categorias
        ? categorias.map((categoria) => ({
            value: categoria.id_categoria,
            label: categoria.nombre_categoria,
          }))
        : [],
      defaultValue: 1,
    },
    {
      name: "id_estado_producto",
      label: "Estado",
      type: "select",
      options: estados
        ? estados.map((estado) => ({
            value: estado.id_estado_producto,
            label: estado.nombre_estado,
          }))
        : [],
      defaultValue: 1,
    },
    {
      name: "id_tipo_producto",
      defaultValue: 1,
    },
  ];

  // Función para manejar formulario
  const handleSubmit = async (data) => {
    try {
      await createProducto(data).unwrap();
      dispatch(showNotification({
        message: "Se ha creado un nuevo producto",
        severity: "success"
      }))
    } catch (error) {
      console.log(error)
      dispatch(showNotification({
        message: `Error al crear producto: ` + error.data.error,
        severity: "warning"
      }))
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    //console.log("Editar producto:", row);
    navigate(`/productos/editar/${row.id_producto}`, {
      state: { refetch: true },
    });
  };

  const handleBulkDelete = async () => {
    try {
      /* setDeleteLoading(true); */
      await deleteProductos({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Productos eliminados correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar productos: ${error.error}`,
          severity: "error",
        })
      );
    } /* finally {
        setDeleteLoading(false);
      } */
  };
  const handleOpenDelete = () => {
    if (selectedRows.length > 0) {
      setOpenAlert(true);
    } else {
      dispatch(
        showNotification({
          message: "Debe seleccionar al menos un producto.",
          severity: "warning",
        })
      );
    }
  };
  const rowsPerPageOptions = [5, 10, 25, 50];
  const isAllLoading = isLoading || loadingCategorias || loadingEstados;

  if (isAllLoading) return <LoaderComponent />;
  if (isError) {
    dispatch(
      showNotification({
        message: `Error al obtener productos: ${error.error}`,
        severity: "error",
      })
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Header title="Productos" subtitle="Lista de Productos" />
      {/* Botón para agregar un nuevo producto */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          color="error"
          variant="contained"
          onClick={handleOpenDelete}
          disabled={selectedRows.length === 0 || isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
          onClick={() => setOpen(true)}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* DataGrid para mostrar productos */}
      <Box
        sx={{
          height: 600,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f4f4",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data?.productos}
          getRowId={(row) => row.id_producto}
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
        title="¿Eliminar Producto?"
        onConfirm={handleBulkDelete}
        onCloseAlert={() => setOpenAlert(false)}
        message={`¿Está seguro de que desea eliminar los ${selectedRows.length} productos seleccionados?`}
      />
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title={"Añadir Nuevo Producto"}
      />
    </Box>
  );
};

export default Productos;
