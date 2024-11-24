import { loginSuccess, logout } from "../reducers/authSlice";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL });

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await baseQuery({
      url: "/auth/login",
      method: "POST",
      body: credentials,
      credentials: "include",
    });

    if (response.error) {
      throw new Error(response.error);
    }

    dispatch(loginSuccess(response.data)); // Dispatch a la acción del slice
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const response = await baseQuery({
      url: "/auth/logout",
      method: "POST",
      credentials: "include",
    });

    if (response.error) {
      throw new Error(response.error);
    }

    dispatch(logout());
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
};
