import { authApi } from "./authApi";
import { usuariosApi } from "./usuariosApi";
import {clientesApi} from "./clientesApi";

import {ventasApi} from "./ventasApi";
import { inventarioApi } from "./inventarioApi"; // Similar a los ejemplos anteriores
import {categoriaApi} from "./categoriaApi";
import {estadoProductoApi} from "./estadoProductoApi";
import { ventasEstadisticasApi } from "./analisisApi";
import { facturasApi } from "./facturasApi";
import { estadosFacturaApi } from "./estadosFacturaApi";
import { pagosApi } from "./pagosApi";
import { estadosTransaccionApi } from "./estadoTransaccionApi";
import { estadosDetallesApi } from "./estadoDetallesApi";
import { rolesApi } from "./rolesApi";
import permisosApi from "./permisosRolesApi";
import logTransaccionesApi from "./logTransaccionesApi";
import auditLogsApi from "./auditLogsApi";
import { empresaApi } from "./empresaApi";
import inventarioCamionsApi from "./inventarioCamionApi";
import { entregasApi } from "./entregasApi";
import camionesApi from "./camionesApi";
import agendaApi from "./agendaApi";
import { analisisProductosApi } from "./analisisProductosApi";
import ventasChoferApi from "./ventasChoferApi";

//import { ventasApi } from "./ventasApi";
//import { proveedoresApi } from "./proveedoresApi";

export const apiMiddleware = [
  authApi.middleware,
  usuariosApi.middleware,
  clientesApi.middleware,
  ventasApi.middleware,
  estadosTransaccionApi.middleware,
  inventarioApi.middleware,
  categoriaApi.middleware,
  estadoProductoApi.middleware,
  ventasEstadisticasApi.middleware,
  facturasApi.middleware,
  estadosFacturaApi.middleware,
  pagosApi.middleware,
  estadosDetallesApi.middleware,
  rolesApi.middleware,
  permisosApi.middleware,
  logTransaccionesApi.middleware,
  auditLogsApi.middleware,
  empresaApi.middleware,
  inventarioCamionsApi.middleware,
  entregasApi.middleware,
  camionesApi.middleware,
  agendaApi.middleware,
  analisisProductosApi.middleware,
  ventasChoferApi.middleware,
  /*ventasApi.middleware,
  proveedoresApi.middleware, */
];

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usuariosApi.reducerPath]: usuariosApi.reducer,
  [clientesApi.reducerPath]: clientesApi.reducer,
  [ventasApi.reducerPath]: ventasApi.reducer,
  [estadosTransaccionApi.reducerPath]: estadosTransaccionApi.reducer,
  [inventarioApi.reducerPath]: inventarioApi.reducer,
  [categoriaApi.reducerPath]: categoriaApi.reducer,
  [estadoProductoApi.reducerPath]: estadoProductoApi.reducer,
  [ventasEstadisticasApi.reducerPath]: ventasEstadisticasApi.reducer,
  [facturasApi.reducerPath]: facturasApi.reducer,
  [estadosFacturaApi.reducerPath]: estadosFacturaApi.reducer,
  [pagosApi.reducerPath]: pagosApi.reducer,
  [estadosDetallesApi.reducerPath]: estadosDetallesApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [permisosApi.reducerPath]: permisosApi.reducer,
  [logTransaccionesApi.reducerPath]: logTransaccionesApi.reducer,
  [auditLogsApi.reducerPath]: auditLogsApi.reducer,
  [empresaApi.reducerPath]: empresaApi.reducer,
  [inventarioCamionsApi.reducerPath]: inventarioCamionsApi.reducer,
  [entregasApi.reducerPath]: entregasApi.reducer,
  [camionesApi.reducerPath]: camionesApi.reducer,
  [agendaApi.reducerPath]: agendaApi.reducer,
  [analisisProductosApi.reducerPath]: analisisProductosApi.reducer,
  [ventasChoferApi.reducerPath]: ventasChoferApi.reducer,
  /*[ventasApi.reducerPath]: ventasApi.reducer,
  [proveedoresApi.reducerPath]: proveedoresApi.reducer, */
};

const apiServices = {
  authApi,
  usuariosApi,
  clientesApi,
  ventasApi,
  inventarioApi,
  categoriaApi,
  estadoProductoApi,
  ventasEstadisticasApi,
  estadosTransaccionApi,
  facturasApi,
  estadosFacturaApi,
  pagosApi,
  estadosDetallesApi,
  rolesApi,
  permisosApi,
  logTransaccionesApi,
  auditLogsApi,
  empresaApi,
  inventarioCamionsApi,
  entregasApi,
  camionesApi,
  agendaApi,
  analisisProductosApi,
  ventasChoferApi
  /*ventasApi,
  proveedoresApi, */
};

export default apiServices;
