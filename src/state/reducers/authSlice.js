import { createSlice } from "@reduxjs/toolkit";
/* import { AUTH_LOGIN, AUTH_LOGOUT } from "../constants/authConstants"; */

const initialState = {
  isAuthenticated: false, // Indica si el usuario está autenticado
  user: null, // Información del usuario autenticado
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // Guardamos los datos del usuario
    }, */
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // Actualiza el estado con el usuario autenticado
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { /* loginSuccess, */ setUser, logout } = authSlice.actions;

export default authSlice.reducer;
