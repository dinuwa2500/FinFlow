"use client";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { DashboardHeader } from "@/widgets/dashboard-header/ui/DashboardHeader";
import { CategoryList } from "@/widgets/category-management/ui/CategoryList";

export const CategoriesPage = () => {
  return (
    <DashboardLayout>
      <div className='min-h-screen space-y-8'>
        <DashboardHeader />
        <div className="px-1">
            <CategoryList />
        </div>
      </div>
    </DashboardLayout>
  );
};
