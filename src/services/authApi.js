import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logout } from "../state/reducers/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    credentials: "include", // Para enviar/recibir cookies
    /* tagTypes: ["Auth"], */
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          //console.log(data)
          //dispatch(loginSuccess(data)); // Actualiza el estado global con los datos del usuario
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
        }
      },
    }),
    getAuthenticatedUser: builder.query({
      query: () => "/auth/me",
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user)); // Actualiza el usuario en el estado global
        } catch (error) {
          console.error("Error al obtener usuario autenticado:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout()); // Limpia el estado global al cerrar sesión
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAuthenticatedUserQuery,
  useLogoutMutation,
} = authApi;
