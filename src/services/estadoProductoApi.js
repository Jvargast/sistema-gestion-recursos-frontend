import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const estadoProductoApi = createApi({
  reducerPath: "estadoProductoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/estados-productos", // Asegúrate de tener configurada esta variable
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["EstadosProductos"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todos los estados
    getAllEstados: builder.query({
      query: (params) => ({
        url: `/`,
        params
      }),
      providesTags: ["EstadosProductos"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            const {data} = await queryFulfilled;
            console.log("Lista de estados obtenida:", data);
        } catch (error) {
            console.log("Error al obtener la lista de estados", error)
        }
      }
    }),

    // Obtener estado por ID
    getEstadoById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["EstadosProductos"],
    }),

    // Crear un nuevo estado
    createEstado: builder.mutation({
      query: (newCategoria) => ({
        url: "/",
        method: "POST",
        body: newCategoria,
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),

    // Actualizar un estado existente
    updateEstado: builder.mutation({
      query: ({ id, updatedEstado }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedEstado,
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),

    // Eliminar un estado
    deleteEstado: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useGetAllEstadosQuery,
  useGetEstadoByIdQuery,
  useCreateEstadoMutation,
  useUpdateEstadoMutation,
  useDeleteEstadoMutation,
} = estadoProductoApi;

export default estadoProductoApi;
