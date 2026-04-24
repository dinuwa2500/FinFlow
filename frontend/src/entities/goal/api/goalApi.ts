import { baseApi } from "@/shared/api/baseApi";

export interface Goal {
  _id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export const goalApi = {
  get: async () => {
    const response = await baseApi.get<Goal>("/goals");
    return response.data;
  },
  update: async (data: Goal) => {
    const response = await baseApi.put<Goal>("/goals", data);
    return response.data;
  }
};
