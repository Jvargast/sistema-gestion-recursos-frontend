import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  useCreateNewUserMutation,
  useGetAllUsersQuery,
} from "../../../services/usuariosApi";
import LoaderComponent from "../../../components/common/LoaderComponent";
import usePaginatedData from "../../../hooks/usePaginateData";
import BackButton from "../../../components/common/BackButton";
import {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
} from "../../../services/empresaApi";
import ModalForm from "../../../components/common/ModalForm";
import { useGetAllRolesQuery } from "../../../services/rolesApi";

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [createNewUser] = useCreateNewUserMutation();

  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    paginacion: usuariosPaginacion,
    handlePageChange: handleUsuariosPageChange,
  } = usePaginatedData(useGetAllUsersQuery);

  const { data: empresas, isLoading: isLoadingEmpresas } =
    useGetAllEmpresasQuery();
  const { data: sucursales, isLoading: isLoadingSucursales } =
    useGetAllSucursalsQuery();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRolesQuery();

  const rolesOptions = rolesData?.roles
    ? rolesData.roles
        .filter((role) => role.id && role.nombre) // Filtrar roles válidos
        .map((role) => ({
          value: role.id,
          label: role.nombre,
        }))
    : [];

  // Mapea los datos de usuarios para asegurar que sean correctos
  const usuariosMapped =
    usuarios?.map((user) => ({
      ...user,
      rol: user?.rol?.nombre || "Sin rol",
      Empresa: user?.Empresa?.nombre || "Sin empresa",
      Sucursal: user?.Sucursal?.nombre || "Sin sucursal",
      ultimo_login: user?.ultimo_login
        ? new Date(user.ultimo_login).toLocaleString()
        : "Nunca",
    })) || [];

  const columns = [
    { field: "sequentialId", headerName: "ID", flex: 0.15 },
    { field: "nombre", headerName: "Nombre", flex: 0.3 },
    { field: "apellido", headerName: "Apellido", flex: 0.3 },
    { field: "email", headerName: "Email", flex: 0.4 },
    {
      field: "rol",
      headerName: "Rol",
      flex: 0.3,
    },
    {
      field: "Empresa",
      headerName: "Empresa",
      flex: 0.4,
    },
    {
      field: "Sucursal",
      headerName: "Sucursal",
      flex: 0.4,
    },
    {
      field: "ultimo_login",
      headerName: "Último Login",
      flex: 0.4,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const fields = [
    { name: "rut", label: "RUT", type: "text", defaultValue: "" },
    { name: "nombre", label: "Nombre", type: "text", defaultValue: "" },
    { name: "apellido", label: "Apellido", type: "text", defaultValue: "" },
    { name: "email", label: "Email", type: "text", defaultValue: "" },
    {
      name: "rolId",
      label: "Rol",
      type: "select",
      options: rolesData?.roles
        ? rolesData?.roles?.map((rol) => ({
            value: rol.id,
            label: rol.nombre,
          }))
        : [], // Opciones dinámicas para roles
      defaultValue: rolesOptions[0]?.value || "", // Asegura un valor inicial válido
      searchable: true,
      searchOption: "Agregar nuevo rol",
      route: "/roles",
    },
    {
      name: "id_empresa",
      label: "Empresa",
      type: "select",
      options: empresas
        ? empresas.map((empresa) => ({
            value: empresa.id_empresa,
            label: empresa.nombre,
          }))
        : [],
      defaultValue: "",
      searchable: true,
      searchOption: "Agregar nueva empresa",
      route: "/empresas/crear",
    },
    {
      name: "id_sucursal",
      label: "Sucursal",
      type: "select",
      options: sucursales
        ? sucursales.map((sucursal) => ({
            value: sucursal.id_sucursal,
            label: sucursal.nombre,
          }))
        : [],
      defaultValue: "",
      searchable: true,
      searchOption: "Agregar nueva sucursal",
      route: "/sucursales/crear",
    },
  ];

  const handleAddUser = () => {
    setOpen(true); // Abre el modal
  };

  const handleSubmit = async (newUser) => {
    try {
      await createNewUser(newUser).unwrap();
      setOpen(false); // Cierra el modal tras éxito
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleEdit = (user) => {
    console.log("Editar usuario:", user);
    // Implementa la lógica para editar
  };

  const isAllLoading =
    isLoadingEmpresas ||
    isLoadingRoles ||
    isLoadingSucursales ||
    isLoadingUsuarios;

  if (isAllLoading) return <LoaderComponent />;

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <BackButton to="/admin" label="Volver al menú" />
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Card className="shadow-lg hover:shadow-xl transition rounded-lg">
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Lista de Usuarios</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Nuevo Usuario
            </Button>
          </Box>
          <DataGrid
            getRowId={(row) => row?.rut}
            rows={usuariosMapped || []}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={usuariosPaginacion?.totalItems || 0}
            pageSize={usuariosPaginacion?.pageSize || 10}
            page={usuariosPaginacion?.currentPage - 1 || 0}
            onPageChange={(newPage) =>
              handleUsuariosPageChange(newPage, usuariosPaginacion?.pageSize)
            }
            onPageSizeChange={(newPageSize) =>
              handleUsuariosPageChange(0, newPageSize)
            }
            rowsPerPageOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
          />
        </CardContent>
      </Card>
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title="Crear Nuevo Usuario"
      />
    </Box>
  );
};

export default UserManagement;
