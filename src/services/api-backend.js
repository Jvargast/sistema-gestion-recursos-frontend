import { authApi } from "./authApi";
import { usuariosApi } from "./usuariosApi";
import {clientesApi} from "./clientesApi";

import {ventasApi} from "./ventasApi";
import { inventarioApi } from "./inventarioApi"; // Similar a los ejemplos anteriores
import {categoriaApi} from "./categoriaApi";
import {estadoProductoApi} from "./estadoProductoApi";
import { ventasEstadisticasApi } from "./analisisApi";
//import { ventasApi } from "./ventasApi";
//import { proveedoresApi } from "./proveedoresApi";

export const apiMiddleware = [
  authApi.middleware,
  usuariosApi.middleware,
  clientesApi.middleware,
  ventasApi.middleware,
  inventarioApi.middleware,
  categoriaApi.middleware,
  estadoProductoApi.middleware,
  ventasEstadisticasApi.middleware,
  /*ventasApi.middleware,
  proveedoresApi.middleware, */
];

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usuariosApi.reducerPath]: usuariosApi.reducer,
  [clientesApi.reducerPath]: clientesApi.reducer,
  [ventasApi.reducerPath]: ventasApi.reducer,
  [inventarioApi.reducerPath]: inventarioApi.reducer,
  [categoriaApi.reducerPath]: categoriaApi.reducer,
  [estadoProductoApi.reducerPath]: estadoProductoApi.reducer,
  [ventasEstadisticasApi.reducerPath]: ventasEstadisticasApi.reducer,
  /*[ventasApi.reducerPath]: ventasApi.reducer,
  [proveedoresApi.reducerPath]: proveedoresApi.reducer, */
};

export default {
  authApi,
  usuariosApi,
  clientesApi,
  ventasApi,
  inventarioApi,
  categoriaApi,
  estadoProductoApi,
  ventasEstadisticasApi,
  /*ventasApi,
  proveedoresApi, */
};
