import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const usuariosApi = createApi({
  reducerPath: "usuariosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
      ? process.env.REACT_APP_BASE_URL
      : API_URL,
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
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener usuario por RUT:", error);
        }
      },
    }),
    // Obtener todos los usuarios
    getAllUsers: builder.query({
      query: (params) => ({ url: `/usuarios/`, params }),
      providesTags: ["User"], // Cache para invalidar al crear o actualizar usuarios
      transformResponse: (response) => ({
        usuarios: response.data, // El array de usuarios
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de usuarios:", error);
        }
      },
    }),
    // Obtener chofers
    getAllChoferes: builder.query({
      query: () => `/usuarios/choferes`,
      providesTags: ["User"],
    }),
    // Crear un usuario
    createNewUser: builder.mutation({
      query: (newUser) => ({
        url: `/usuarios/crear`,
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
    updateUserPassword: builder.mutation({
      query: ({ rut, newPassword }) => ({
        url: `/usuarios/${rut}/change-password`,
        method: "PUT",
        body: { newPassword },
      }),
      invalidatesTags: ["User"], // Invalida el caché del usuario
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Contraseña actualizada correctamente.");
        } catch (error) {
          console.error("Error al actualizar la contraseña:", error);
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
    getOwnProfile: builder.query({
      query: () => "/usuarios/mi-perfil",
      providesTags: ["User"], // Cache de usuario
    }),
    changePassword: builder.mutation({
      query: (updates) => ({
        url: `/usuarios/change-password`,
        method: "POST",
        body: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Perfil actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar el perfil:", error);
        }
      },
    }),
    updateMyProfile: builder.mutation({
      query: (updates) => ({
        url: `/usuarios/mi-perfil`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Perfil actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar el perfil:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useFindByRutQuery,
  useGetAllUsersQuery,
  useCreateNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllChoferesQuery,
  useUpdateMyProfileMutation,
  useGetOwnProfileQuery,
  useChangePasswordMutation,
  useUpdateUserPasswordMutation
} = usuariosApi;
export default usuariosApi;
