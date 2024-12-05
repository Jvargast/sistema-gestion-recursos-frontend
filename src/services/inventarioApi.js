import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const inventarioApi = createApi({
  reducerPath: "inventarioApi",
  baseQuery: fetchBaseQuery({
    baseUrl: /* process.env.REACT_APP_BASE_URL ?  process.env.REACT_APP_BASE_URL : */ API_URL + "/productos", // Asegúrate de tener configurada esta variable
    credentials: "include", // Para enviar cookies si es necesario
  }),
  tagTypes: ["Producto"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todos los productos
    getAllProductos: builder.query({
      query: (params) => ({
        url: `/`,
        params
      }),
      providesTags: ["Producto"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            const {data} = await queryFulfilled;
            console.log("Lista de productos obtenida:", data);
        } catch (error) {
            console.log("Error al obtener la lista de productos", error)
        }
      }
    }),

    // Obtener producto por ID
    getProductoById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Producto"],
    }),

    // Obtener productos por tipo
    getProductosByTipo: builder.query({
      query: (tipo) => `/tipo/${tipo}`,
      providesTags: ["Producto"],
    }),

    // Crear un nuevo producto
    createProducto: builder.mutation({
      query: (newProducto) => ({
        url: "/",
        method: "POST",
        body: newProducto,
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
    }),

    // Actualizar un producto existente
    updateProducto: builder.mutation({
      query: ({ id, updatedProducto }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedProducto,
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
    }),

    // Eliminar un producto
    deleteProducto: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useGetAllProductosQuery,
  useGetProductoByIdQuery,
  useGetProductosByTipoQuery,
  useCreateProductoMutation,
  useUpdateProductoMutation,
  useDeleteProductoMutation,
} = inventarioApi;

export default inventarioApi;
