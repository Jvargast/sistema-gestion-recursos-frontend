import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeSettings } from "./theme";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
/* import Login from "scenes/login"; */
import Layout from "./pages/layout";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/utils/ProtectedRoutes";
import Login from "./pages/login";
import Productos from "./pages/productos";
import Clientes from "./pages/clientes";
import Cotizaciones from "./pages/transacciones/cotizaciones";
import Pedidos from "./pages/transacciones/pedidos";
import Ventas from "./pages/transacciones/ventas";
import Insumos from "./pages/insumos";
import Facturas from "./pages/facturas";
import Pagos from "./pages/pagos";
import Administracion from "./pages/administracion";
import EditarFactura from "./pages/facturas/EditarFactura";
import { logout, setUser } from "./state/reducers/authSlice";
import CrearCliente from "./pages/clientes/CrearCliente";
import EditarCotizacion from "./pages/transacciones/cotizaciones/EditarCotizacion";
import EditarPedido from "./pages/transacciones/pedidos/EditarPedido";
import EditarVenta from "./pages/transacciones/ventas/EditarVenta";
import EditarPago from "./pages/pagos/EditarPago";
import VerCliente from "./pages/clientes/VerCliente";
import EditarCliente from "./pages/clientes/EditarCliente";
import Seguridad from "./pages/administracion/seguridad";
import RoleManagement from "./pages/administracion/Roles/RoleManagement";
import EditRole from "./pages/administracion/Roles/EditRoleManagement";
import UserManagement from "./pages/administracion/usuarios";
import EditUserPage from "./pages/administracion/usuarios/EditUserPage";
import CategoriaManagement from "./pages/categorias";
import NotFoundPage from "./pages/NotFoundPage";
import EntregasManagement from "./pages/entregas/EntregasManagement";
import Empresa from "./pages/administracion/empresa";
import EstadisticasAno from "./pages/analisis/PanelEstadisticas";
import AgendaManagement from "./pages/entregas/AgendaManagement";
import CamionesManagement from "./pages/entregas/CamionesManagement";
import AgendaDetail from "./pages/entregas/AgendaDetail";
import EntregasCompletadas from "./pages/entregas/EntregasCompletadas";
import PanelEstadisticas from "./pages/analisis/PanelEstadisticas";
import { useGetAuthenticatedUserQuery } from "./services/authApi";
import LoaderComponent from "./components/common/LoaderComponent";
import RoleBasedRoute from "./components/utils/RoleBasedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import EditarProducto from "./pages/productos/EditarProducto";
import EditarInsumo from "./pages/insumos/EditarInsumo";
import VentasChofer from "./pages/entregas/VentasChofer";
import EditarEmpresa from "./pages/administracion/empresa/EditarEmpresa";
import Perfil from "./pages/perfil";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const rol = useSelector((state) => state.auth.rol);
  const theme = useMemo(
    () => createTheme(themeSettings(mode, rol)),
    [mode, rol]
  );
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    } else if (error) {
      dispatch(logout());
    } else {
      dispatch({ type: "auth/setLoading", payload: false }); // En caso de error o sin datos
      dispatch({ type: "auth/syncCompleted", payload: true });
    }
  }, [data, error, dispatch]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  // Configuración del enrutador
  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <ProtectedRoute /* isAuthenticated={isAuthenticated}  */ />, // Envolvemos las rutas protegidas
        children: [
          {
            element: <Layout />, // Layout principal
            children: [
              {
                path: "/",
                index: true,
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: (
                  <RoleBasedRoute requiredPermission="ver_dashboard">
                    <Dashboard />
                  </RoleBasedRoute>
                ),
              },
              { path: "facturas", element: <Facturas /> },
              { path: "facturas/editar/:id", element: <EditarFactura /> },
              { path: "pagos", element: <Pagos /> },
              { path: "pagos/editar/:id", element: <EditarPago /> },
              { path: "cotizaciones", element: <Cotizaciones /> },
              {
                path: "cotizaciones/editar/:id",
                element: <EditarCotizacion />,
              },
              { path: "pedidos", element: <Pedidos /> },
              { path: "pedidos/editar/:id", element: <EditarPedido /> },
              { path: "ventas", element: <Ventas /> },
              { path: "ventas/editar/:id", element: <EditarVenta /> },
              { path: "clientes", element: <Clientes /> },
              { path: "clientes/crear", element: <CrearCliente /> },
              { path: "clientes/ver/:id", element: <VerCliente /> },
              { path: "clientes/editar/:id", element: <EditarCliente /> },
              { path: "productos", element: <Productos /> },
              { path: "productos/editar/:id", element: <EditarProducto /> },
              { path: "insumos", element: <Insumos /> },
              { path: "insumos/editar/:id", element: <EditarInsumo /> },
              { path: "categorias", element: <CategoriaManagement /> },
              {
                path: "entregas-completadas",
                element: <EntregasCompletadas />,
              },
              {
                path: "ventas-chofer",
                element: <VentasChofer />,
              },
              { path: "entregas", element: <EntregasManagement /> },
              { path: "camiones", element: <CamionesManagement /> },
              { path: "agendas", element: <AgendaManagement /> },
              { path: "agendas/editar/:id", element: <AgendaDetail /> },
              { path: "usuarios", element: <UserManagement /> },
              { path: "miperfil", element: <Perfil /> },
              { path: "usuarios/editar/:id", element: <EditUserPage /> },
              {
                path: "admin",
                element: (
                  <RoleBasedRoute requiredPermission="ver_administrador">
                    <Administracion />
                  </RoleBasedRoute>
                ),
              },
              { path: "roles", element: <RoleManagement /> },
              { path: "roles/editar/:id", element: <EditRole /> },
              { path: "seguridad", element: <Seguridad /> },
              { path: "empresa", element: <Empresa /> },
              { path: "empresa/editar/:id", element: <EditarEmpresa /> },
              { path: "estadisticas", element: <PanelEstadisticas /> },
              // Agrega otras rutas aquí...
            ],
          },
        ],
      },
      // Redirige cualquier ruta desconocida al login
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
    {
      /* basename: "/sistema-gestion-recursos-frontend", */
      // Habilitar banderas de React Router v7
      future: {
        v7_startTransition: true, // Ya estaba activada
        v7_relativeSplatPath: true, // Ya estaba activada
        v7_fetcherPersist: true, // Nueva bandera
        v7_normalizeFormMethod: true, // Nueva bandera
        v7_partialHydration: true, // Nueva bandera
        v7_skipActionErrorRevalidation: true, // Nueva bandera
      },
    }
  );

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider
          router={router} /* fallbackElement={<LoaderComponent />} */
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
