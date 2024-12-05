import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const categoriaApi = createApi({
  reducerPath: "categoriaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : API_URL + "/categorias-productos", // Asegúrate de tener configurada esta variable
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["Categoria"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todas las categorias
    getAllCategorias: builder.query({
      query: (params) => ({
        url: `/`,
        params
      }),
      providesTags: ["Categoria"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            const {data} = await queryFulfilled;
            console.log("Lista de categorias obtenida:", data);
        } catch (error) {
            console.log("Error al obtener la lista de categorias", error)
        }
      }
    }),

    // Obtener categoria por ID
    getCategoriaById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Categoria"],
    }),

    // Crear un nueva categoria
    createCategoria: builder.mutation({
      query: (newCategoria) => ({
        url: "/",
        method: "POST",
        body: newCategoria,
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),

    // Actualizar una categoria existente
    updateCategoria: builder.mutation({
      query: ({ id, updatedCategoria }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedCategoria,
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),

    // Eliminar una categoria
    deleteCategoria: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useGetAllCategoriasQuery,
  useGetCategoriaByIdQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
} = categoriaApi;

export default categoriaApi;
