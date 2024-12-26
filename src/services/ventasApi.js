import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
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
      transformResponse: (response) => ({
        transacciones: response.data, // El array de transacciones
        paginacion: response.total,   // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          
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
          await queryFulfilled;
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
          await queryFulfilled;
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
          await queryFulfilled;
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
        body: { tipo_transaccion },
      }),
      invalidatesTags: ["TransaccionTipo"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
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
          await queryFulfilled;
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
        url: `/transacciones/${id}/finalizarTransaction`,
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

    // Cambiar método de pago
    changeMetodoPago: builder.mutation({
      query: ({ id, metodo_pago }) => ({
        url: `/transacciones/${id}/changeMetodoPago`,
        method: "PUT",
        body: { metodo_pago },
      }),
      invalidatesTags: ["Transaccion"],
    }),
    // Asignar una transacción a un chofer/usuario
    asignarTransaccion: builder.mutation({
      query: ({ id_transaccion, id_usuario }) => ({
        url: `/transacciones/${id_transaccion}/asignar`,
        method: "POST",
        body: { id_usuario },
      }),
      invalidatesTags: ["Transaccion"], // Refresca las transacciones
    }),

    // Eliminar chofer asignado
    eliminarAsignadoTransaccion: builder.mutation({
      query: (id_transaccion) => ({
        url: `/transacciones/${id_transaccion}/desasignar`,
        method: "PATCH",
      }),
      invalidatesTags: ["Transaccion"],
    }),

    // Eliminar transacciones
    deleteTransacciones: builder.mutation({
      query: ({ ids }) => ({
        url: `/transacciones/`,
        method: "PATCH",
        body: { ids }, // Enviamos el array de IDs en el body
      }),
      invalidatesTags: ["Transaccion"], // Invalida el caché
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar transacciones:", error);
        }
      },
    }),

    // Eliminar detalle transacción
    deleteDetalle: builder.mutation({
      query: ({ id, idDetalle }) => ({
        url: `/transacciones/${id}/detalles/${idDetalle}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaccion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
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
  useDeleteTransaccionesMutation,
  useAsignarTransaccionMutation,
  useEliminarAsignadoTransaccionMutation,
  useChangeMetodoPagoMutation,
} = ventasApi;

export default ventasApi;
