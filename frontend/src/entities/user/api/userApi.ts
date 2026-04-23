import { baseApi } from "@/shared/api/baseApi";
import { UserSignUpData } from "../model/types";

export const userApi = {
  signUp: async (data: UserSignUpData) => {
    const response = await baseApi.post("/auth/register", data);
    return response.data;
  },
  
  login: async (data: any) => {
    const response = await baseApi.post("/auth/login", data);
    return response.data;
  },
};
