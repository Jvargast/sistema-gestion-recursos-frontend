import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rut: "12345678-9", // Almacena el RUT del usuario
  info: null, // Información adicional del usuario (opcional)
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRut: (state, action) => {
      state.rut = action.payload; // Actualiza el RUT
    },
    setUserInfo: (state, action) => {
      state.info = action.payload; // Actualiza la información del usuario
    },
    clearUser: (state) => {
      state.rut = null; // Limpia el estado del usuario
      state.info = null;
    },
  },
});

export const { setRut, setUserInfo, clearUser } = userSlice.actions;

export default userSlice.reducer;