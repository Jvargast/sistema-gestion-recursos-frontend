import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usuariosApi = createApi({
  reducerPath: "usuariosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Obtener usuario por RUT
    findByRut: builder.query({
      query: (rut) => `/usuarios/${rut}`,
      providesTags: ["User"], // Cache de usuarios
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener usuario por RUT:", error);
        }
      },
    }),
    // Obtener todos los usuarios
    getAllUsers: builder.query({
      query: () => `/usuarios/`,
      providesTags: ["User"], // Cache para invalidar al crear o actualizar usuarios
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de usuarios:", error);
        }
      },
    }),
    // Crear un usuario
    createUser: builder.mutation({
      query: (newUser) => ({
        url: `/usuarios/`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Usuario creado exitosamente:", data);
        } catch (error) {
          console.error("Error al crear usuario:", error);
        }
      },
    }),
    // Actualizar un usuario
    updateUser: builder.mutation({
      query: ({ rut, updates }) => ({
        url: `/usuarios/${rut}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Usuario actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar usuario:", error);
        }
      },
    }),
    // Dar de baja un usuario
    deleteUser: builder.mutation({
      query: (rut) => ({
        url: `/usuarios/${rut}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Usuario eliminado correctamente");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useFindByRutQuery,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation, 
  useDeleteUserMutation, 
} = usuariosApi;
export default usuariosApi;
