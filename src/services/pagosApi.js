import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const pagosApi = createApi({
  reducerPath: "pagosApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/pagos",
    credentials: "include",
  }),
  tagTypes: ["Pago"],
  endpoints: (builder) => ({
    getMetodosDePago: builder.query({
      query: () => "/metodos-pago",
      providesTags: ["Pagos"]
    }),
    getPagoById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Pagos"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener pago: ", error)
        }
      }
    }),
    registrarMetodoDePago: builder.mutation({
      query: ({ id, metodo_pago }) => ({
        url: `/${id}/nuevo-metodo-pago`,
        method: "POST",
        body: { metodo_pago },
      }),
    }),
    getAllPagos: builder.query({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Pagos"],
      transformResponse: (response) => ({
        pagos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener pagos: ", error);
        }
      },
    }),
    //Actualiar pago
    updatePago: builder.mutation({
      query: ({id,updated}) => ({
        url:`/${id}`,
        method: "PATCH",
        body: updated 
      }),
      invalidatesTags: ["Pagos"]
    }),

    // Borrar Pagos
    deletePagos: builder.mutation({
      query: ({ids}) => ({
        url: `/`,
        method: "PATCH",
        body: {ids},
      }),
      invalidatesTags: ["Pagos"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar pagos: ", error)
        }
      }
    })
  }),
});

export const {
  useGetPagoByIdQuery,
  useGetMetodosDePagoQuery,
  useRegistrarMetodoDePagoMutation,
  useGetAllPagosQuery,
  useUpdatePagoMutation,
  useDeletePagosMutation,
} = pagosApi;

export default pagosApi;
