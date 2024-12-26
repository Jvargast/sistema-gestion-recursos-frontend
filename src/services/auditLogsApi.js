import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const auditLogsApi = createApi({
  reducerPath: "auditLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include", // Para enviar/recibir cookies
  }),
  tagTypes: ["AuditLogs"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todos los roles
    getLogs: builder.query({
      query: (params) => ({ url: `/audit-logs/`, params }),
      providesTags: ["AuditLogs"], // Para invalidar cache
      transformResponse: (response) => ({
        auditLogs: response.data, // Datos de logs
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
export const { useGetLogsQuery } = auditLogsApi;

export default auditLogsApi;
