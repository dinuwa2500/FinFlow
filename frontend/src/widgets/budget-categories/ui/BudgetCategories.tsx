"use client";
import { CategoryBudget } from "@/entities/budget/model/types";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { Home, ShoppingBasket, Film, Zap, AlertCircle, LayoutGrid } from "lucide-react";

const iconMap: any = {
  Housing: Home,
  Groceries: ShoppingBasket,
  Entertainment: Film,
  Utilities: Zap,
};

export const BudgetCategories = ({ data }: { data: CategoryBudget[] }) => {
  return (
    <div className='space-y-4 mt-8'>
      <div className='flex justify-between items-end mb-4'>
        <h2 className='text-xl font-bold text-gray-800'>Expense Categories</h2>
        <button className='text-sm text-indigo-600 font-medium hover:underline'>
          View Detailed Insights →
        </button>
      </div>

      {data.map((cat) => {
        const percent = (cat.spent / cat.limit) * 100;
        const isOver = percent > 100;
        const color = isOver ? "danger" : percent > 80 ? "primary" : "success";
        const Icon = iconMap[cat.name] || LayoutGrid;

        return (
          <div
            key={cat.id}
            className={`bg-white p-4 rounded-2xl border flex items-center gap-4 transition-all ${isOver ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isOver ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
            >
              <Icon size={20} />
            </div>
            <div className='flex-1'>
              <div className='flex justify-between mb-1'>
                <div>
                  <span className='text-sm font-bold'>{cat.name}</span>
                  <p className='text-[10px] text-gray-400'>{cat.description}</p>
                </div>
                <div className='text-right'>
                  <span
                    className={`text-xs font-bold ${isOver ? "text-red-600" : "text-gray-800"}`}
                  >
                    ${cat.spent} / ${cat.limit}
                  </span>
                  <div className='text-[10px] text-gray-400'>
                    {Math.round(percent)}% used
                  </div>
                </div>
              </div>
              <ProgressBar progress={percent} color={color} />
            </div>
            <div className='ml-6 text-right min-w-[100px]'>
              <p className='text-[10px] text-gray-400 uppercase'>
                {isOver ? "Over Budget" : "Remaining"}
              </p>
              <p
                className={`text-sm font-bold ${isOver ? "text-red-600" : "text-gray-800"}`}
              >
                ${Math.abs(cat.limit - cat.spent).toFixed(2)}
              </p>
            </div>
            {isOver && <AlertCircle className='text-red-500' size={18} />}
          </div>
        );
      })}
    </div>
  );
};
