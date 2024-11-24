import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usuariosApi = createApi({
  reducerPath: "usuariosApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    findByRut: builder.query({
      query: (rut) => `/api/usuarios/${rut}`,
      providesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => `/api/usuarios`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: `/api/usuarios`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useFindByRutQuery,
  useGetAllUsersQuery,
  useCreateUserMutation,
} = usuariosApi;
export default usuariosApi;
