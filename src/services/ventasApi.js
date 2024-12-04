import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";
export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["Cotizacion"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todas las cotizaciones
    getAllTransacciones: builder.query({
      query: (params) => ({
        url: `/transacciones/`,
        params,
      }),
        /* {
        const queryParams = new URLSearchParams(params).toString(); // Convierte el objeto params en query string
        return `/transacciones/?${queryParams}`; // Agrega los parámetros a la URL
      }, */
      providesTags: ["Cotizacion"], // Cache de cotizaciones
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cotizaciones obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener cotizaciones:", error);
        }
      },
    }),

    // Obtener una cotización por ID
    /* getCotizacionById: builder.query({
      query: (id) => `/cotizaciones/${id}`,
      providesTags: ["Cotizacion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cotización obtenida:", data);
        } catch (error) {
          console.error("Error al obtener cotización:", error);
        }
      },
    }), */

    // Crear una nueva cotización
    /* createCotizacion: builder.mutation({
      query: (newCotizacion) => ({
        url: "/cotizaciones",
        method: "POST",
        body: newCotizacion,
      }),
      invalidatesTags: ["Cotizacion"], // Invalida cache para actualizar automáticamente la lista
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cotización creada exitosamente:", data);
        } catch (error) {
          console.error("Error al crear cotización:", error);
        }
      },
    }), */

    // Actualizar una cotización existente
    /* updateCotizacion: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/cotizaciones/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Cotizacion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cotización actualizada correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar cotización:", error);
        }
      },
    }), */

    // Eliminar una cotización
    /* deleteCotizacion: builder.mutation({
      query: (id) => ({
        url: `/cotizaciones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cotizacion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cotización eliminada correctamente");
        } catch (error) {
          console.error("Error al eliminar cotización:", error);
        }
      },
    }), */
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetAllTransaccionesQuery,
  /* useGetCotizacionByIdQuery,
  useCreateCotizacionMutation,
  useUpdateCotizacionMutation,
  useDeleteCotizacionMutation, */
} = ventasApi;

export default ventasApi;
