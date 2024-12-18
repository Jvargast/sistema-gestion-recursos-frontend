import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const estadosTransaccionApi = createApi({
  reducerPath: "estadosTransaccionApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL) + "/estado-transaccion",
  }),
  tagTypes: ["EstadoTransaccion"],
  endpoints: (builder) => ({
    getAllEstados: builder.query({
      query: (params) => ({ url: `/`, params }),
      providesTags: ["EstadoTransaccion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de estados", error);
        }
      },
    }),
  }),
});

export const { useGetAllEstadosQuery } = estadosTransaccionApi;
