import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}

export const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-slate-100 text-slate-900"
        : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    {icon}
    <span className='text-sm font-medium'>{label}</span>
  </Link>
);
