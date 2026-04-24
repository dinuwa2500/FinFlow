export interface BudgetSummary {
  totalBudget: number;
  spent: number;
  remaining: number;
  dailyLimit: number;
  daysLeft: number;
  savingsPercentage: number;
}

export interface CategoryBudget {
  id: string;
  name: string;
  description: string;
  spent: number;
  limit: number;
  icon: React.ReactNode;
}

export interface Goal {
  title: string;
  current: number;
  target: number;
}