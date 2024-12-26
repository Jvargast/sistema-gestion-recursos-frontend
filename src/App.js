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
import { API_URL } from "./services/apiBase";
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


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();

  useEffect(() => {
    const syncAuth = async () => {
      try {
        //Se debe cambiar para guardar en servidor
        const response = await fetch(
          `${
            process.env.REACT_APP_BASE_URL
              ? process.env.REACT_APP_BASE_URL
              : API_URL
          }/auth/me`,
          {
            method: "GET",
            credentials: "include", // Incluye las cookies
          }
        );
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            dispatch(setUser(data.usuario)); // Sincroniza el estado con el backend
          } else {
            console.error("Respuesta no es JSON");
            dispatch(logout());
          }
        } else {
          console.error("Error en la respuesta del servidor:", response.status);
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error al sincronizar la autenticación:", error);
        dispatch(logout());
      }
    };

    syncAuth();
  }, [dispatch]);
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
              { path: "dashboard", element: <Dashboard /> },
              { path: "facturas", element: <Facturas /> },
              { path: "facturas/editar/:id", element: <EditarFactura /> },
              { path: "pagos", element: <Pagos /> },
              { path: "pagos/editar/:id", element: <EditarPago /> },
              { path: "cotizaciones", element: <Cotizaciones /> },
              { path: "cotizaciones/editar/:id", element: <EditarCotizacion /> },
              { path: "pedidos", element: <Pedidos /> },
              { path: "pedidos/editar/:id", element: <EditarPedido /> },
              { path: "ventas", element: <Ventas /> },
              { path: "ventas/editar/:id", element: <EditarVenta/>},
              { path: "clientes", element: <Clientes /> },
              { path: "clientes/crear", element: <CrearCliente /> },
              { path: "clientes/ver/:id", element: <VerCliente/> },
              { path: "clientes/editar/:id", element: <EditarCliente/> },
              { path: "productos", element: <Productos /> },
              { path: "insumos", element: <Insumos /> },
              { path: "usuarios", element: <UserManagement /> },
              { path: "admin", element: <Administracion /> },
              { path: "roles", element: <RoleManagement /> },
              { path: "roles/editar/:id", element: <EditRole /> },
              { path: "seguridad", element: <Seguridad /> },
              // Agrega otras rutas aquí...
            ],
          },
        ],
      },
      // Redirige cualquier ruta desconocida al login
      {
        path: "*",
        element: <Navigate to="/login" replace />,
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
