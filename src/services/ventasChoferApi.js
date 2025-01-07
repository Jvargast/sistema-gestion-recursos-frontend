import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const ventasChoferApi = createApi({
  reducerPath: "ventasChoferApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["VentaChofer"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todas las cotizaciones
    getVentasChofer: builder.query({
      query: (params) => ({
        url: `/ventas-chofer/`,
        params,
      }),
      providesTags: ["VentaChofer"],
      transformResponse: (response) => ({
        ventasChofer: response.data, // El array de transacciones
        paginacion: response.total,   // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          
        } catch (error) {
          console.error("Error al obtener ventas:", error);
        }
      },
    }),

    // Obtener una cotización por ID
    getVentaChoferByID: builder.query({
      query: (id) => `/ventas-chofer/${id}`,
      providesTags: ["VentaChofer"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener venta:", error);
        }
      },
    }),

    // Crear una nueva transacción
    realizarVentaRapida: builder.mutation({
      query: (nuevaVenta) => ({
        url: "/ventas-chofer/rapida",
        method: "POST",
        body: nuevaVenta,
      }),
      invalidatesTags: ["VentaChofer"], // Invalida cache para actualizar automáticamente la lista
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear venta:", error);
        }
      },
    }),

    
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetVentasChoferQuery,
  useGetVentaChoferByIDQuery,
  useRealizarVentaRapidaMutation
} = ventasChoferApi;

export default ventasChoferApi;
