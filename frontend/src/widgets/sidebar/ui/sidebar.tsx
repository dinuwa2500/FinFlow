"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Folder,
  LogOut,
  Wallet,
  CalendarDays,
  PlusCircle,
} from "lucide-react";
import { NavItem } from "@/shared/ui/nav-item"; // Import from Shared

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: <ArrowLeftRight size={18} />,
    },
  
    {
      label: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <CalendarDays size={18} />,
    },
    { label: "Budgets", href: "/budgets", icon: <PieChart size={18} /> },
    { label: "Categories", href: "/categories", icon: <Folder size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className='w-72 h-screen p-4 bg-gray-50 flex flex-col'>
      <div className='flex-1 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col'>
        {/* Brand */}
        <div className='flex items-center gap-2 mb-8 px-2'>
          <div className='p-2 bg-indigo-600 rounded-lg text-white'>
            <Wallet size={20} />
          </div>
          <h1 className='font-bold text-xl tracking-tight text-slate-800'>
            FinanceApp
          </h1>
        </div>

        {/* Nav list */}
        <nav className='space-y-1'>
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Logout at bottom */}
        <button 
          onClick={handleLogout}
          className='mt-auto flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors'
        >
          <LogOut size={18} />
          <span className='text-sm font-medium'>Log out</span>
        </button>
      </div>
    </div>
  );
};
