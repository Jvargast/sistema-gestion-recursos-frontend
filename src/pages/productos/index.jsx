import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useCreateProductoMutation,
  useDeleteProductoMutation,
  useGetAllProductosQuery,
} from "../../services/inventarioApi";
import { useGetAllCategoriasQuery } from "../../services/categoriaApi";
import { useGetAllEstadosQuery } from "../../services/estadoProductoApi";
import { DataGrid } from "@mui/x-data-grid";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";

const Productos = () => {
  const theme = useTheme();
  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading } = useGetAllProductosQuery({
    tipo_producto: "Producto_Terminado",
    search,
  });
  const {
    data: categorias,
    loadingCategorias,
    error,
  } = useGetAllCategoriasQuery();
  const {
    data: estados,
    loadingEstados,
    errorEstados,
  } = useGetAllEstadosQuery();
  const [createProducto] = useCreateProductoMutation();
  const [deleteProducto] = useDeleteProductoMutation();

  // Selección de filas
  const [selectedRows, setSelectedRows] = useState([]);
  // Selección producto
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Modal agregar productos
  const [open, setOpen] = useState(false);
  // Dialog Alert
  const [openAlert, setOpenAlert] = useState(false);
  // Arreglo de datos
  const rows = data
    ? data.map((row) => ({
        ...row,
        categoriaNombre: row.categoria?.nombre_categoria || "Sin categorias",
        inventarioNombre: row.inventario?.cantidad || "Sin inventario",
        estadoNombre: row.estado?.nombre_estado || "Sin estado",
        image: row.image || "https://via.placeholder.com/50",
        id: row.id_producto,
      }))
    : [];

  // Definir las columnas del DataGrid
  const columns = [
    {
      field: "image",
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
    { field: "id_producto", headerName: "ID", flex: 0.25 },
    { field: "inventarioNombre", headerName: "Stock", flex: 0.315 },
    { field: "nombre_producto", headerName: "Nombre", flex: 0.5 },
    { field: "codigo_barra", headerName: "Código de Barra", flex: 0.5 },
    { field: "marca", headerName: "Marca", flex: 0.3 },
    { field: "precio", headerName: "Precio", flex: 0.3 },
    { field: "categoriaNombre", headerName: "Categoría", flex: 0.4 },
    { field: "estadoNombre", headerName: "Estado", flex: 0.5 },
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
          <IconButton
            color="error"
            onClick={(event) => {
              event.stopPropagation();
              /* setOpenAlert(true); */
              handleDeleteClick(params.row);
            }}
          >
            <DeleteIcon />
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
        ? categorias?.map((categoria) => ({
            value: categoria.id_categoria,
            label: categoria.nombre_categoria,
          }))
        : [],
      /* [
        { value: "agua", label: "Agua" },
        { value: "hielo", label: "Hielo" },
      ], */
      defaultValue: 1,
    },
    {
      name: "id_estado_producto",
      label: "Estado",
      type: "select",
      options: estados
        ? estados?.map((estado) => ({
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
      console.log("Datos formulario", data);
    } catch (error) {
      alert("Error al crear Producto");
      console.error(error);
    }
  };

  // Función para manejar la acción de editar
  const handleEdit = (row) => {
    console.log("Editar producto:", row);
    // Aquí puedes implementar lógica adicional, como abrir un modal para editar la cotización
  };
  const handleDeleteClick = (row) => {
    setSelectedProduct(row);
    setOpenAlert(true);
  };
  // Función para manejar la acción de eliminar
  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        console.log("Eliminar producto:", selectedProduct);
        await deleteProducto(selectedProduct.id_producto).unwrap();
        setOpenAlert(false);
        setSelectedProduct(null);
      } catch (error) {
        console.log("Error al eliminar Producto", error);
      }
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Botón para agregar un nuevo producto */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ textTransform: "none" /* , borderRadius: "10%" */ }}
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
          getRowId={(row) => row.id_producto}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={isLoading || !data}
          disableSelectionOnClick
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
        />
      </Box>
      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Producto?"
        onConfirm={handleDelete}
        onCloseAlert={() => {
          setOpenAlert(false);
          setSelectedProduct(null);
        }}
        message="¿Estás seguro que desear eliminar este producto?"
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
