import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const ventasEstadisticasApi = createApi({
  reducerPath: "ventasEstadisticasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : API_URL + "/analisis/ventas",
    credentials: "include",
  }),
  tagTypes: ["AnalisisVenta"],
  endpoints: (builder) => ({
    getAllEstadisticas: builder.query({
      query: (params) => ({ url: "/", params }),
      providesTags: ["AnalisisVenta"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Lista de estadísticas obtenidas:", data);
        } catch (error) {
          console.log("Error al obtener la lista de estadísticas ", error);
        }
      },
    }),

    obtenerPorAno: builder.query({
      query: (year) => ({
        url: `/ano/${year}`,
        providesTags: ["AnalisisVenta"],
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estadísticas enviadas exitosamente:", data);
        } catch (error) {
          console.log("Error al enviar las estadísticas:", error);
        }
      },
    }),
    obtenerPorMes: builder.query({
      query: ({ year, month }) =>
        `/ventas-estadisticas/ano/${year}/mes/${month}`,
    }),
    monitorearVentasRecientes: builder.query({
      query: () => "/ventas-estadisticas/monitoreo/ventas-recientes",
    }),
  }),
});

export const {
  useGetAllEstadisticasQuery,
  useObtenerPorAnoQuery,
  useGetMonthlyStatsQuery,
  useGetRecentSalesQuery,
} = ventasEstadisticasApi;
