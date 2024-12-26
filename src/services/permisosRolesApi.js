import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const permisosApi = createApi({
    reducerPath: "permisosApi",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.REACT_APP_BASE_URL
        ? process.env.REACT_APP_BASE_URL
        : API_URL,
      credentials: "include", // Para enviar/recibir cookies
    }),
    tagTypes: ["Permiso"], // Identificador para invalidar cache
    endpoints: (builder) => ({
      // Obtener todos los permisos
      getAllpermisos: builder.query({
        query: (params) => ({ url: `/permisos/`, params }),
        providesTags: ["Permiso"], // Para invalidar cache
        transformResponse: (response) => ({
          permisos: response.data, // Datos de permisos
          paginacion: response.total, // Datos de paginación
        }),
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al obtener la lista de permisos:", error);
          }
        },
      }),
  
      // Obtener un rol por ID
      getPermisoById: builder.query({
        query: (id) => `/permisos/${id}`,
        providesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al obtener el Permiso:", error);
          }
        },
      }),
  
      // Crear un rol
      createPermiso: builder.mutation({
        query: (newPermiso) => ({
          url: `/permisos/`,
          method: "POST",
          body: newPermiso,
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al crear el Permiso:", error);
          }
        },
      }),
  
      // Actualizar un rol
      updatePermiso: builder.mutation({
        query: ({ id, ...formData }) => ({
          url: `/permisos/${id}`,
          method: "PUT",
          body: formData,
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log("Permiso actualizado correctamente:", data);
          } catch (error) {
            console.error("Error al actualizar el Permiso:", error);
          }
        },
      }),
  
      // Eliminar un rol
      deletePermiso: builder.mutation({
        query: (id) => ({
          url: `/permisos/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al eliminar el Permiso:", error);
          }
        },
      }),
    }),
  });
  
  // Exporta los hooks generados automáticamente
  export const {
    useGetAllpermisosQuery,
    useGetPermisoByIdQuery,
    useCreatePermisoMutation,
    useUpdatePermisoMutation,
    useDeletePermisoMutation
  } = permisosApi;
  
  export default permisosApi;