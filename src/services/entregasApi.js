import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const entregasApi = createApi({
  reducerPath: "entregasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include",
  }),
  tagTypes: ["Entrega"],
  endpoints: (builder) => ({
    createEntrega: builder.mutation({
      query: (entrega) => ({
        url: "/entregas/",
        method: "POST",
        body: entrega,
      }),
      invalidatesTags: ["Entrega"],
    }),
    getEntregaById: builder.query({
      query: (id) => `/${id}`,
    }),
    getAllEntregas: builder.query({
      query: (params) => ({ url: `/entregas/`, params }),
      providesTags: ["Entrega"],
      transformResponse: (response) => ({
        entregas: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            await queryFulfilled
        } catch (error) {
            console.log("Error al obtener entregas: ", error)
        }
      }
    }),
  }),
});

export const {
  useCreateEntregaMutation,
  useGetEntregaByIdQuery,
  useGetAllEntregasQuery,
} = entregasApi;
