import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const ventasEstadisticasApi = createApi({
  reducerPath: "ventasEstadisticasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.REACT_APP_BASE_URL || API_URL) + "/analisis/ventas",
    credentials: "include",
  }),
  tagTypes: ["AnalisisVenta"],
  endpoints: (builder) => ({
    // Obtener todas las estadísticas con paginación
    getAllEstadisticas: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Lista de estadísticas obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener la lista de estadísticas:", error);
        }
      },
    }),

    // Obtener estadísticas por año
    obtenerPorAno: builder.query({
      query: (year) => ({
        url: `/ano/${year}`,
      }),
      providesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener estadísticas por año:", error);
        }
      },
    }),

    // Obtener estadísticas por mes
    obtenerPorMes: builder.query({
      query: ({ year, month }) => ({
        url: `/ano/${year}/mes/${month}`,
      }),
      providesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas por mes obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener estadísticas por mes:", error);
        }
      },
    }),

    // Calcular estadísticas por año
    calcularEstadisticasPorAno: builder.mutation({
      query: (year) => ({
        url: "/calcular/ano",
        method: "POST",
        body: { year },
      }),
      invalidatesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas calculadas por año:", data);
        } catch (error) {
          console.error("Error al calcular estadísticas por año:", error);
        }
      },
    }),

    // Actualizar estadísticas globales
    actualizarEstadisticasGlobales: builder.mutation({
      query: () => ({
        url: "/actualizar/globales",
        method: "POST",
      }),
      invalidatesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas globales actualizadas:", data);
        } catch (error) {
          console.error("Error al actualizar estadísticas globales:", error);
        }
      },
    }),

    // Monitorear ventas recientes
    monitorearVentasRecientes: builder.query({
      query: () => ({
        url: "/monitoreo/ventas-recientes",
      }),
      providesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Ventas recientes monitoreadas:", data);
        } catch (error) {
          console.error("Error al monitorear ventas recientes:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllEstadisticasQuery,
  useObtenerPorAnoQuery,
  useObtenerPorMesQuery,
  useCalcularEstadisticasPorAnoMutation,
  useActualizarEstadisticasGlobalesMutation,
  useMonitorearVentasRecientesQuery,
} = ventasEstadisticasApi;
