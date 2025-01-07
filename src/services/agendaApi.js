import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const agendaApi = createApi({
  reducerPath: "agendaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
    credentials: "include",
  }),
  tagTypes: ["Agenda"],
  endpoints: (builder) => ({
    createAgenda: builder.mutation({
      query: (agenda) => ({
        url: "/agendas/",
        method: "POST",
        body: agenda,
      }),
      invalidatesTags: ["Agenda"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al crear agenda: ", error);
        }
      },
    }),
    getAgendaById: builder.query({
      query: (id) => `/agendas/${id}`,
      providesTags: ["Agenda"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener agenda: ", error);
        }
      },
    }),
    getAgendaActiva: builder.query({
      query: () => `/agendas/activa/chofer`,
      providesTags: ["Agenda"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener agenda: ", error);
        }
      },
    }),
    startAgenda: builder.mutation({
      query: (id) => ({
        url: `/agendas/start/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Agenda"],
    }),
    finalizeAgenda: builder.mutation({
      query: (id) => ({
        url: `/agendas/finalizar/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Agenda"],
    }),
    getAllAgendas: builder.query({
      query: (params) => ({ url: "/agendas/", params }),
      providesTags: ["Agenda"],
      transformResponse: (response) => ({
        agendas: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener las agendas: ", error);
        }
      },
    }),
    getAgendasByChofer: builder.query({
      query: (params) => ({
        url: `/agendas/agendaChofer`,
        params,
      }),
      providesTags: ["Agenda"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener las agendas: ", error);
        }
      },
    }),
    updateAgenda: builder.mutation({
      query: ({ id, ...agenda }) => ({
        url: `/agendas/${id}`,
        method: "PUT",
        body: agenda,
      }),
      invalidatesTags: ["Agenda"],
    }),
    deleteAgenda: builder.mutation({
      query: (id) => ({
        url: `/agendas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agenda"],
    }),
  }),
});

export const {
  useCreateAgendaMutation,
  useGetAgendaByIdQuery,
  useGetAgendaActivaQuery,
  useStartAgendaMutation,
  useFinalizeAgendaMutation,
  useGetAgendasByChoferQuery,
  useGetAllAgendasQuery,
  useUpdateAgendaMutation,
  useDeleteAgendaMutation,
} = agendaApi;

export default agendaApi;
