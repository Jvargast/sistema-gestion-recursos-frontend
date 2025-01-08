import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import ventasApi from "../../services/ventasApi";
import { authApi } from "../../services/authApi";

const initialState = {
  isAuthenticated: false,  // Indica si el usuario está autenticado
  user: null, // Información del usuario autenticado
  rol: null,
  permisos: [],
  isLoading: true,
  token: null,
  syncCompleted: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.usuario;
      state.rol = action.payload.rol; 
      state.permisos = action.payload.permisos; 
      state.isLoading = false; // Carga completada
      state.syncCompleted = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.rol = null;
      state.permisos = [];
      state.isLoading = false; // Carga completada
      state.syncCompleted = true;
      Cookies.remove("authToken");
      window.location.href = "/login";
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // Actualiza el estado de carga
    },
  },
});

export const {  setUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;

export const resetCacheAndLogout = () => (dispatch) => {
  // Resetea el estado global
  dispatch(ventasApi.util.resetApiState());
  dispatch(authApi.util.resetApiState());
  dispatch(logout());
};

