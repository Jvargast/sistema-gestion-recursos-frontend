import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const pagosApi = createApi({
  reducerPath: "pagosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : API_URL) + "/pagos",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMetodosDePago: builder.query({
      query: () => "/metodos-pago",
    }),
  }),
});

export const { useGetMetodosDePagoQuery } = pagosApi;

export default pagosApi;
