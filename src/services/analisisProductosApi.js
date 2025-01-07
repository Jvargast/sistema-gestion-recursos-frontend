import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const analisisProductosApi = createApi({
  reducerPath: "analisisProductosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.REACT_APP_BASE_URL || API_URL) + "/analisis/productos",
    credentials: "include",
  }),
  tagTypes: ["AnalisisProducto"],
  endpoints: (builder) => ({
    // Obtener todas las estadísticas con filtros y paginación
    getAllEstadisticas: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["AnalisisProducto"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Lista de estadísticas de productos obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener estadísticas de productos:", error);
        }
      },
    }),

    // Obtener estadísticas por producto y año
    obtenerPorProductoYAno: builder.query({
      query: ({ id_producto, year }) => ({
        url: `/${id_producto}/year/${year}`,
      }),
      providesTags: ["AnalisisProducto"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas por producto y año obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener estadísticas por producto y año:", error);
        }
      },
    }),

    // Calcular estadísticas por año para todos los productos
    calcularEstadisticasAno: builder.mutation({
      query: (year) => ({
        url: "/calcular-year",
        method: "POST",
        body: { year },
      }),
      invalidatesTags: ["AnalisisProducto"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas calculadas por año para productos:", data);
        } catch (error) {
          console.error("Error al calcular estadísticas por año para productos:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllEstadisticasQuery,
  useObtenerPorProductoYAnoQuery,
  useCalcularEstadisticasAnoMutation,
} = analisisProductosApi;
