import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const logTransaccionesApi = createApi({
  reducerPath: "logTransaccionesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include", // Para enviar/recibir cookies
  }),
  tagTypes: ["LogTransacciones"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todos los roles
    getAllLogs: builder.query({
      query: (params) => ({ url: `/logs-transaccion/`, params }),
      providesTags: ["LogTransacciones"], // Para invalidar cache
      transformResponse: (response) => ({
        logs: response.data, // Datos de logs
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de roles:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const { useGetAllLogsQuery } = logTransaccionesApi;

export default logTransaccionesApi;
