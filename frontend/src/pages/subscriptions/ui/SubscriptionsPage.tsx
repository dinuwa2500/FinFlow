"use client";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { DashboardHeader } from "@/widgets/dashboard-header/ui/DashboardHeader";
import { SubscriptionManagement } from "@/widgets/subscription-management/ui/SubscriptionManagement";

export const SubscriptionsPage = () => {
  return (
    <DashboardLayout>
      <div className='min-h-screen'>
        <DashboardHeader />
        <div className="px-8 py-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Management</h2>
          <SubscriptionManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};
