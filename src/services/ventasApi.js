import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : API_URL,
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["Transaccion"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todas las cotizaciones
    getAllTransacciones: builder.query({
      query: (params) => ({
        url: `/transacciones/`,
        params,
      }),
      providesTags: ["Transaccion"], 
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //console.log("Cotizaciones obtenidas:", data);
        } catch (error) {
          console.error("Error al obtener cotizaciones:", error);
        }
      },
    }),

    // Obtener una cotización por ID
    getTransaccionById: builder.query({
      query: (id) => `/transacciones/${id}`,
      providesTags: ["Transaccion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Transaccion obtenida:", data);
        } catch (error) {
          console.error("Error al obtener cotización:", error);
        }
      },
    }),

    // Crear una nueva transacción
    createTransaccion: builder.mutation({
      query: (newCotizacion) => ({
        url: "/transacciones/",
        method: "POST",
        body: newCotizacion,
      }),
      invalidatesTags: ["Transaccion"], // Invalida cache para actualizar automáticamente la lista
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cotización creada exitosamente:", data);
        } catch (error) {
          console.error("Error al crear cotización:", error);
        }
      },
    }),

    // Cambiar estado de transaccion
    changeEstado: builder.mutation({
      query: ({ id, id_estado_transaccion }) => ({
        url: `/transacciones/${id}/changeEstado`,
        method: "PUT",
        body: id_estado_transaccion,
      }),
      invalidatesTags: ["Transaccion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          console.log("Estado actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar cotización:", error);
        }
      },
    }),

    // Cambiar tipo de transacción
    changeTipoTransaccion: builder.mutation({
      query: ({ id, tipo_transaccion }) => ({
        url: `/transacciones/${id}/changeTipo`,
        method: "PUT",
        body: {tipo_transaccion},
      }),
      invalidatesTags: ["TransaccionTipo"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        
        try {
          const { data } = await queryFulfilled;
          console.log("Tipo actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar tipo:", error);
        }
      },
    }),

    // Cambiar detalles info
    changeDetallesInfo: builder.mutation({
      query: ({ id, ...updated }) => ({
        url: `/transacciones/${id}/changeDetallesInfo`,
        method: "PUT",
        body: updated,
      }),
      invalidatesTags: ["TransaccionDetalles"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        
        try {
          const { data } = await queryFulfilled;
          console.log("Detalles actualizados correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar tipo:", error);
        }
      },
    }),

    // Completar transacción
    completeTransaction: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/transacciones/${id}/completeTransaction`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Transaccion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Se ha completado correctamente:", data);
        } catch (error) {
          console.error("Error al completar:", error);
        }
      },
    }),

    // Completar transacción
    finalizarTransaccion: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/transacciones/${id}/finalizarTransaccion`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Transaccion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Se ha finalizó correctamente:", data);
        } catch (error) {
          console.error("Error al finalizar:", error);
        }
      },
    }),


    // Eliminar una cotización
    deleteCotizacion: builder.mutation({
      query: (id) => ({
        url: `/transacciones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaccion"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cotización eliminada correctamente");
        } catch (error) {
          console.error("Error al eliminar cotización:", error);
        }
      },
    }),

    // Eliminar detalle transacción
    deleteDetalle: builder.mutation({
      query: ({ id, idDetalle }) => ({
        url: `/transacciones/${id}/detalles/${idDetalle}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Transaccion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Detalle eliminado correctamente");
        } catch (error) {
          console.error("Error al eliminar detalle:", error);
        }
      },

    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetAllTransaccionesQuery,
  useGetTransaccionByIdQuery,
  useCreateTransaccionMutation,
  useChangeEstadoMutation,
  useChangeTipoTransaccionMutation,
  useCompleteTransactionMutation,
  useFinalizarTransaccionMutation,
  useChangeDetallesInfoMutation,
  useDeleteDetalleMutation,
  /* useDeleteCotizacionMutation, */
} = ventasApi;

export default ventasApi;
