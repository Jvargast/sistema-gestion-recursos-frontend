import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const empresaApi = createApi({
  reducerPath: "empresas",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include",
  }),
  tagTypes: ["Empresa"],
  endpoints: (builder) => ({
    // empresas
    getAllEmpresas: builder.query({
      query: () => "/empresas/",
      providesTags: ["Empresa"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener empresas:", error);
        }
      },
    }),

    // Logs inicio de sesión
    getAllSucursals: builder.query({
      query: () => "/sucursales/",
      providesTags: ["Empresa"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener sucursales:", error);
        }
      },
    }),
  }),
});

export const { useGetAllEmpresasQuery, useGetAllSucursalsQuery } = empresaApi;
