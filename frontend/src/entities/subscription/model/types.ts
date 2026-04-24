export interface Subscription {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  startDate: string;
  nextBillingDate: string;
  logo: string;
  status: 'active' | 'cancelled' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDto {
  name: string;
  amount: number;
  billingCycle: string;
  category: string;
  nextBillingDate: string;
}
