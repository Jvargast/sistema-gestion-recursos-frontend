import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const inventarioCamionsApi = createApi({
  reducerPath: "inventarioCamionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include",
  }),
  tagTypes: ["InventarioCamion"],
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (product) => ({
        url: "/inventario-camion/",
        method: "POST",
        body: product,
      }),
      providesTags: ["InventarioCamion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Errore al agregar producto", error);
        }
      },
    }),
    getProductsByCamion: builder.query({
      query: (id) => `/inventario-camion/${id}`,
      providesTags: ["InventarioCamion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener productos del camión", error);
        }
      },
    }),

    returnProducts: builder.mutation({
      query: (id) => ({
        url: `/inventario-camion/return/${id}`,
        method: "POST",
      }),
      providesTags: ["InventarioCamion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Errore al terminar recorrido", error);
        }
      },
    }),

    getInventarioDisponible: builder.query({
      query: (params) => ({
        url: `/inventario-camion/disponible/`,
        params,
      }),
      providesTags: ["InventarioCamion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
        } catch (error) {
          console.error("Error al obtener inventario:", error);
        }
      },
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsByCamionQuery,
  useLazyGetInventarioDisponibleQuery,
  useReturnProductsMutation,
  useGetInventarioDisponibleQuery,
} = inventarioCamionsApi;

export default inventarioCamionsApi;
