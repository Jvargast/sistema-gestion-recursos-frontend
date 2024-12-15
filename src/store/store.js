import { configureStore } from "@reduxjs/toolkit";
import { apiReducers, apiMiddleware } from "../services/api-backend";
import reducers from "../state/reducers";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "../state/reducers/authSlice";

const persistConfig = {
  key: "auth", // Clave única para persistir este reducer
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    ...reducers, // Registra los reducers de cada módulo
    ...apiReducers,
    /* auth: persistedAuthReducer, */
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(apiMiddleware), // Incluye los middlewares de cada API
  devTools: true,
});

// Configurar reintentos automáticos para RTK Query
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
