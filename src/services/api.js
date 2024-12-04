import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  reducerPath: "adminApi",
  tagTypes: ["User"],
  endpoints: (build) => ({
    findByRut: build.query({
        query: (rut) => `/api/usuarios/${rut}`,
        providesTags: ["User"]
    })
  })
});

export const {
    useFindByRutQuery,
} = api;