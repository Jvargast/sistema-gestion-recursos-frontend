import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
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
/* import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
 */

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // Configuración del enrutador
  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <ProtectedRoute />, // Envolvemos las rutas protegidas
        children: [
          {
            element: <Layout />, // Layout principal
            children: [
              { path: "/", element: <Navigate to="/dashboard" replace /> },
              { path: "/dashboard", element: <Dashboard /> },             
              { path: "/cotizaciones", element: <Cotizaciones/> },
              { path: "/pedidos", element: <Pedidos/> },
              { path: "/ventas", element: <Ventas/> },
              { path: "/clientes", element: <Clientes /> },
              { path: "/productos", element: <Productos /> },
              { path: "/insumos", element: <Insumos /> },   
              // Agrega otras rutas aquí...
            ],
          },
        ],
      },
    ],
    {
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
      {/* <BrowserRouter> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        {/* <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/performance" element={<Performance />} />
              </Route>
            </Route>
          </Routes> */}
      </ThemeProvider>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
