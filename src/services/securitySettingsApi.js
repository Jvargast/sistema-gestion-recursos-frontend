import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiBase";

export const securitySettingsApi = createApi({
  reducerPath: "securitySettingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // Settings
    getSettings: builder.query({
      query: () => "/security-settings",
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: "/security-settings",
        method: "PUT",
        body: settings,
      }),
    }),

    // Logs inicio de sesión
    getLogs: builder.query({
      query: () => "/audit-logs",
    }),
  }),
});

export const {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetAuditLogsQuery,
} = securitySettingsApi;
