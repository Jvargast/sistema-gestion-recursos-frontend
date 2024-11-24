import { authApi } from "./authApi";
import { usuariosApi } from "./usuariosApi";
//import { inventarioApi } from "./inventarioApi"; // Similar a los ejemplos anteriores
//import { ventasApi } from "./ventasApi";
//import { proveedoresApi } from "./proveedoresApi";

export const apiMiddleware = [
  authApi.middleware,
  usuariosApi.middleware,
/*   inventarioApi.middleware,
  ventasApi.middleware,
  proveedoresApi.middleware, */
];

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usuariosApi.reducerPath]: usuariosApi.reducer,
/*   [inventarioApi.reducerPath]: inventarioApi.reducer,
  [ventasApi.reducerPath]: ventasApi.reducer,
  [proveedoresApi.reducerPath]: proveedoresApi.reducer, */
};

export default {
  authApi,
  usuariosApi,
/*   inventarioApi,
  ventasApi,
  proveedoresApi, */
};
