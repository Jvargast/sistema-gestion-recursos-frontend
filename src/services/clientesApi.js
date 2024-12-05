import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const clientesApi = createApi({
  reducerPath: "clientesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: /* process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : */ API_URL,
    credentials: "include", // Para enviar/recibir cookies si es necesario
  }),
  tagTypes: ["Cliente"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener cliente por ID
    getClienteById: builder.query({
      query: (id) => `/clientes/${id}`,
      providesTags: ["Cliente"], // Cache de clientes
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cliente obtenido:", data);
          // Aquí puedes actualizar el estado global si es necesario
        } catch (error) {
          console.error("Error al obtener cliente por ID:", error);
        }
      },
    }),

    // Obtener todos los clientes
    getAllClientes: builder.query({
      query: () => `/clientes/`,
      providesTags: ["Cliente"], // Cache para invalidar al crear o actualizar clientes
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Lista de clientes obtenida:", data);
        } catch (error) {
          console.error("Error al obtener la lista de clientes:", error);
        }
      },
    }),

    // Crear un cliente
    createCliente: builder.mutation({
      query: (newClient) => ({
        url: `/clientes/`,
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cliente creado exitosamente:", data);
        } catch (error) {
          console.error("Error al crear cliente:", error);
        }
      },
    }),

    // Actualizar un cliente
    updateClient: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/clientes/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cliente actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar cliente:", error);
        }
      },
    }),

    // Desactivar un cliente
    deactivateCliente: builder.mutation({
      query: (id) => ({
        url: `/clientes/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cliente desactivado correctamente");
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
        }
      },
    }),

    // Reactivar un cliente
    reactivateCliente: builder.mutation({
        query: (id) => ({
          url: `/clientes/${id}/reactivate`,
          method: "PATCH",
        }),
        invalidatesTags: ["Cliente"], // Invalida cache
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
            console.log("Cliente reactivado correctamente");
          } catch (error) {
            console.error("Error al eliminar cliente:", error);
          }
        },
      }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetClienteByIdQuery,
  useGetAllClientesQuery,
  useCreateClienteMutation,
  useUpdateClientMutation,
  useDeactivateClienteMutation,
  useReactivateClienteMutation
} = clientesApi;

export default clientesApi;
