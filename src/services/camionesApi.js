import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const camionesApi = createApi({
  reducerPath: "camionesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
  }),
  tagTypes: ["Camion"],
  endpoints: (builder) => ({
    createCamion: builder.mutation({
      query: (camion) => ({
        url: "/camiones/",
        method: "POST",
        body: camion,
      }),
      invalidatesTags: ["Camion"],
    }),
    getAllCamiones: builder.query({
      query: (params) => ({ url: `/camiones/`, params }),
      providesTags: ["Camion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener camiones: ", error);
        }
      },
    }),
    getCamionCapacity: builder.query({
      query: (id) => ({ url: `/camiones/capacidad/${id}` }),
      providesTags: ["Camion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getCamionById: builder.query({
      query: (id) => `/camiones/${id}`,
      providesTags: ["Camion"],
    }),
    updateCamion: builder.mutation({
      query: ({ id, ...camion }) => ({
        url: `/camiones/${id}`,
        method: "PUT",
        body: camion,
      }),
      invalidatesTags: ["Camion"],
    }),
    deleteCamion: builder.mutation({
      query: (id) => ({
        url: `/camiones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Camion"],
    }),
  }),
});

export const {
  useCreateCamionMutation,
  useGetAllCamionesQuery,
  useGetCamionCapacityQuery,
  useGetCamionByIdQuery,
  useUpdateCamionMutation,
  useDeleteCamionMutation,
} = camionesApi;

export default camionesApi;
