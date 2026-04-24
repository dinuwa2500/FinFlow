"use client";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { DashboardHeader } from "@/widgets/dashboard-header/ui/DashboardHeader";
import { StatsGrid } from "@/widgets/stats-grid/ui/StatsGrid";
import { ExpenseAnalytics } from "@/widgets/expense-analytics/ui/ExpenseAnalytics";
import { TransactionManagement } from "@/widgets/transaction-management/ui/TransactionManagement";


export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className='min-h-screen'>
        <DashboardHeader />
        <StatsGrid />
        
        {/* MIDDLE ANALYTICS ROW */}
        <ExpenseAnalytics />

        {/* BOTTOM TRANSACTIONS ROW */}
        <TransactionManagement />
      </div>
    </DashboardLayout>
  );
};
