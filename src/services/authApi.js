import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logout, setLoading } from "../state/reducers/authSlice";
import { API_URL } from "./apiBase";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include", // Para enviar/recibir cookies
    tagTypes: ["Auth"], //
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {...credentials},
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true)); // Activa el estado de carga
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.usuario));
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    getAuthenticatedUser: builder.query({
      query: () => "/auth/me",
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.usuario)); // Actualiza el usuario en el estado global
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
          dispatch(logout());
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
