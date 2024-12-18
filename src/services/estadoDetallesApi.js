import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const estadosDetallesApi = createApi({
  reducerPath: "estadosDetallesApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/estado-detalle",
    credentials: "include",
  }),
  tagTypes: ["EstadoDetalle"],
  endpoints: (builder) => ({
    // Endpoint para obtener todos los estados de factura
    getEstadosDetalle: builder.query({
      query: () => "/",
      providesTags: ["EstadoDetalle"], // Mueve providesTags dentro del endpoint
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de estaods", error);
        }
      },
    }),
  }),
});

export const { useGetEstadosDetalleQuery } = estadosDetallesApi;
