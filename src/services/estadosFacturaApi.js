import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

/* export const estadosFacturaApi = createApi({
  reducerPath: "estadosFacturaApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/estado-factura",
  }),
  tagTypes: ["EstadoFactura"],
  endpoints: (builder) => ({
    // Obtener todos los estados
    getAllEstadosFactura: builder.query({
      query: () => "/",
    }),
    providesTags: ["EstadoFactura"],
    async onQueryStarted(args, { queryFulfilled }) {
      try {
        const { data } = await queryFulfilled;
        console.log("Estados", data);
      } catch (error) {
        console.log("Error al obtener la lista de estaods", error);
      }
    },
  }),
}); */
export const estadosFacturaApi = createApi({
  reducerPath: "estadosFacturaApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/estado-factura",
  }),
  tagTypes: ["EstadoFactura"],
  endpoints: (builder) => ({
    // Endpoint para obtener todos los estados de factura
    getAllEstadosFactura: builder.query({
      query: () => "/",
      providesTags: ["EstadoFactura"], // Mueve providesTags dentro del endpoint
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estados", data);
        } catch (error) {
          console.log("Error al obtener la lista de estaods", error);
        }
      },
    }),
  }),
});

export const { useGetAllEstadosFacturaQuery  } = estadosFacturaApi;
