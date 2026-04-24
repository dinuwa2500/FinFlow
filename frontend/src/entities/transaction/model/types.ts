export type TransactionType = 'expense' | 'income';

export interface TransactionData {
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  category: string;
  note?: string;
}