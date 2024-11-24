import { configureStore } from "@reduxjs/toolkit";
import { apiReducers, apiMiddleware } from "../services/api-backend";
import reducers from "../state/reducers";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    ...reducers, // Registra los reducers de cada módulo
    ...apiReducers

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware), // Incluye los middlewares de cada API
});

// Configurar reintentos automáticos para RTK Query
setupListeners(store.dispatch);

export default store;
