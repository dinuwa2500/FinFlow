import { ReactNode } from "react";
import { Sidebar } from "@/widgets/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className='flex h-screen bg-slate-100'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto p-8'>
        {children}
      </main>
    </div>
  );
};
