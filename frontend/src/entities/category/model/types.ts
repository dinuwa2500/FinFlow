export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense' | 'all';
  icon?: string;
  color?: string;
  userId?: string;
}
