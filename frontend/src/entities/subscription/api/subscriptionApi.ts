import { baseApi } from "@/shared/api/baseApi";
import { Subscription, CreateSubscriptionDto } from "../model/types";

export const subscriptionApi = {
  getAll: async () => {
    const response = await baseApi.get<{ data: Subscription[] }>("/subscriptions");
    return response.data.data;
  },
  getRecent: async () => {
    const response = await baseApi.get<{ data: Subscription[] }>("/subscriptions/recent");
    return response.data.data;
  },
  create: async (data: CreateSubscriptionDto) => {
    const response = await baseApi.post<{ data: Subscription }>("/subscriptions", data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await baseApi.delete(`/subscriptions/${id}`);
  },
};
