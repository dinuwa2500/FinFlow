import { baseApi } from "@/shared/api/baseApi";
import { Category } from "../model/types";

export const categoryApi = {
  getAll: async (type?: string) => {
    const response = await baseApi.get<Category[]>("/categories", {
      params: { type },
    });
    return response.data;
  },
  create: async (data: Partial<Category>) => {
    const response = await baseApi.post<Category>("/categories", data);
    return response.data;
  },
  update: async (id: string, data: Partial<Category>) => {
    const response = await baseApi.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await baseApi.delete(`/categories/${id}`);
    return response.data;
  },
};
