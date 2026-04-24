import { baseApi } from "@/shared/api/baseApi";
import { BudgetSummary, CategoryBudget, Goal } from "../model/types";

export const budgetApi = {
  async getSummary(): Promise<BudgetSummary> {
    const response = await baseApi.get('/budget/summary');
    return response.data;
  },
  async getCategories(): Promise<CategoryBudget[]> {
    const response = await baseApi.get('/budget/categories');
    return response.data;
  },
  async getActiveGoal(): Promise<Goal> {
    const response = await baseApi.get('/budget/goal');
    return response.data;
  }
};