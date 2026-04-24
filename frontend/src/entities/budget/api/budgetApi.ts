import { baseApi } from "@/shared/api/baseApi";

export interface BudgetProgress {
  id: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentUsed: string;
  isExceeded: boolean;
}

export const budgetApi = {
  getBudgets: async (month: number, year: number) => {
    const response = await baseApi.get<BudgetProgress[]>("/budgets", {
      params: { month, year }
    });
    return response.data;
  },
  createBudget: async (data: { categoryId: string; amount: number; period: { month: number; year: number } }) => {
    const response = await baseApi.post("/budgets", data);
    return response.data;
  },
  updateBudget: async (id: string, amount: number) => {
    const response = await baseApi.patch(`/budgets/${id}`, { amount });
    return response.data;
  },
  deleteBudget: async (id: string) => {
    const response = await baseApi.delete(`/budgets/${id}`);
    return response.data;
  }
};