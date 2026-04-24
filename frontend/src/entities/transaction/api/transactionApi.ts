import { baseApi } from "@/shared/api/baseApi";
import { TransactionData } from "../model/types";

export const transactionApi = {
  async create(data: TransactionData) {
    const response = await baseApi.post('/transactions', data);
    return response.data;
  },
  async list(filters?: any) {
    const response = await baseApi.get('/transactions', { params: filters });
    return response.data;
  },
  async getSummary(month?: number, year?: number) {
    const response = await baseApi.get('/transactions/summary', { params: { month, year } });
    return response.data;
  },
  async getHistory() {
    const response = await baseApi.get('/transactions/history');
    return response.data;
  },
  async getCategoryStats() {
    const response = await baseApi.get('/transactions/category-stats');
    return response.data;
  }
};

// Maintain backward compatibility with TransactionManagement.tsx
export const fetchRecentExpenses = () => transactionApi.list();