import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://shope-smoky.vercel.app',
    credentials: 'include',
  });
export const apiSlice = createApi({
    baseQuery,
    tagTypes:['user'],
    endpoints:(builder) => ({})
})