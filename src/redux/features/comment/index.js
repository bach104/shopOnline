import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() + "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
      transformResponse: (response) => ({
        ...response,
        size: response.size || [],
        color: response.color || [],
      }),
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/products/addProducts",
        method: "POST",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    editProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
} = productApi;