"use client";
import { BudgetProgress } from "@/entities/budget/api/budgetApi";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { Home, ShoppingBasket, Film, Zap, AlertCircle, LayoutGrid, Coffee, Heart, Car, Pencil } from "lucide-react";

const iconMap: Record<string, any> = {
  Housing: Home,
  Groceries: ShoppingBasket,
  Entertainment: Film,
  Utilities: Zap,
  Food: Coffee,
  Health: Heart,
  Transport: Car,
};

interface BudgetCategoriesProps {
  data: BudgetProgress[];
  onEdit?: (budget: BudgetProgress) => void;
}

export const BudgetCategories = ({ data, onEdit }: BudgetCategoriesProps) => {
  if (data.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LayoutGrid size={24} className="text-indigo-400" />
        </div>
        <h3 className="font-bold text-gray-700 mb-1">No Budgets This Month</h3>
        <p className="text-sm text-gray-400">Click "Set New Budget" to start tracking your spending limits.</p>
      </div>
    );
  }

  return (
    <div className='space-y-3 mt-8'>
      <div className='flex justify-between items-center mb-4 px-1'>
        <h2 className='text-xl font-bold text-gray-800'>Spending by Category</h2>
        <span className="text-xs text-gray-400 font-medium">{data.length} budget{data.length !== 1 ? 's' : ''} active</span>
      </div>

      {data.map((cat) => {
        const percent = parseFloat(cat.percentUsed);
        const color = cat.isExceeded ? "danger" : percent > 80 ? "primary" : "success";
        const Icon = iconMap[cat.category] || LayoutGrid;

        return (
          <div
            key={cat.id}
            className={`bg-white px-6 py-5 rounded-2xl border flex items-center gap-5 transition-all hover:shadow-md group ${cat.isExceeded ? "border-red-200 bg-red-50/10" : "border-gray-100"}`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cat.isExceeded ? "bg-red-100 text-red-600" : "bg-indigo-50 text-indigo-600"}`}>
              <Icon size={22} />
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-base font-bold text-gray-900'>{cat.category}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${cat.isExceeded ? "text-red-600" : "text-gray-900"}`}>
                    ${cat.spent.toLocaleString()}
                    <span className="text-gray-300 font-medium"> / </span>
                    <span className="text-gray-500 font-semibold">${cat.budget.toLocaleString()}</span>
                  </span>
                  {cat.isExceeded && <AlertCircle size={15} className="text-red-500 shrink-0" />}
                </div>
              </div>
              <ProgressBar progress={percent} color={color} />
              <div className="flex justify-between mt-1">
                <span className={`text-[10px] font-bold ${cat.isExceeded ? 'text-red-500' : 'text-gray-400'}`}>
                  {percent.toFixed(0)}% utilised
                </span>
                <span className={`text-[10px] font-bold ${cat.isExceeded ? 'text-red-600' : 'text-green-600'}`}>
                  {cat.isExceeded ? "Over by" : "Remaining:"} ${cat.remaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={() => onEdit(cat)}
                className="opacity-0 group-hover:opacity-100 transition-all p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl shrink-0"
                title="Edit budget"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
