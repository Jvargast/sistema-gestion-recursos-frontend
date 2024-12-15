import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isAuthenticated: false,  // Indica si el usuario está autenticado
  user: null, // Información del usuario autenticado
  isLoading: true,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // Actualiza el estado con el usuario autenticado
      state.isLoading = false; // Carga completada
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false; // Carga completada
      Cookies.remove("authToken");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // Actualiza el estado de carga
    },
  },
});

export const {  setUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;

