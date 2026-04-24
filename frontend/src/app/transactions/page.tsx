"use client";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { DashboardHeader } from "@/widgets/dashboard-header/ui/DashboardHeader";
import { TransactionManagement } from "@/widgets/transaction-management/ui/TransactionManagement";
import { Button } from "@/shared/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className='min-h-screen'>
        <DashboardHeader />
        
        <div className="px-8 py-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
              <p className="text-gray-500 text-sm">View and manage all your financial activities</p>
            </div>
            <Link href="/add-transaction">
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                New Transaction
              </Button>
            </Link>
          </div>

          {/* We'll use the existing TransactionManagement but we might want to expand it later for full list */}
          <TransactionManagement />
        </div>
      </div>
    </DashboardLayout>
  );
}
