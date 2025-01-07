import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const facturasApi = createApi({
  reducerPath: "facturasApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/facturas",
    credentials: "include",
  }),
  tagTypes: ["Facturas"],
  endpoints: (builder) => ({
    // Obtener todas las facturas con filtros y paginación
    getAllFacturas: builder.query({
      query: (filters) => {
        const queryParams = new URLSearchParams(filters).toString();
        return `/?${queryParams}`;
      },
      providesTags: ["Facturas"],
      transformResponse: (response) => ({
        facturas: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de facturas", error);
        }
      },
    }),

    // Obtener una factura por ID
    getFacturaById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Facturas", id }],
    }),

    // Crear una factura desde una transacción
    crearFacturaDesdeTransaccion: builder.mutation({
      query: (transaccionData) => ({
        url: "/desde-transaccion",
        method: "POST",
        body: transaccionData,
      }),
      invalidatesTags: ["Facturas"],
    }),

    // Crear una factura independiente
    crearFacturaIndependiente: builder.mutation({
      query: (facturaData) => ({
        url: "/",
        method: "POST",
        body: facturaData,
      }),
      invalidatesTags: ["Facturas"],
    }),

    // Actualizar el estado de una factura
    actualizarEstadoFactura: builder.mutation({
      query: ({ id, estado }) => ({
        url: `/${id}/estado`,
        method: "PUT",
        body: { estado },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Facturas", id }],
    }),

    // Actualizar datos factura
    actualizarFactura: builder.mutation({
      query: ({ id, ...updatedFactura }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedFactura,
      }),
      invalidatesTags: ["Facturas"],
    }),

    // Eliminar una factura
    eliminarFactura: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Facturas", id }],
    }),

    // Borrar Facturas
    deleteFacturas: builder.mutation({
      query: ({ ids }) => ({
        url: `/`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["Facturas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar facturas: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllFacturasQuery,
  useGetFacturaByIdQuery,
  useCrearFacturaDesdeTransaccionMutation,
  useCrearFacturaIndependienteMutation,
  useActualizarEstadoFacturaMutation,
  useActualizarFacturaMutation,
  useEliminarFacturaMutation,
  useDeleteFacturasMutation,
} = facturasApi;
