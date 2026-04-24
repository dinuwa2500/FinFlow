"use client";
import { useEffect, useState } from "react";

import { BudgetCategories } from "@/widgets/budget-categories/ui/BudgetCategories";
import { budgetApi } from "@/entities/budget/api/budgetApi";
import {
  BudgetSummary,
  CategoryBudget,
  Goal,
} from "@/entities/budget/model/types";
import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/ProgressBar";

export const BudgetPage = () => {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [s, c, g] = await Promise.all([
        budgetApi.getSummary(),
        budgetApi.getCategories(),
        budgetApi.getActiveGoal(),
      ]);
      setSummary(s);
      setCategories(c);
      setGoal(g);
    };
    loadData();
  }, []);

  return (
    <div className='flex min-h-screen bg-gray-50'>
   
      <main className='flex-1 ml-64 p-10'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Budget Management
            </h1>
            <p className='text-sm text-gray-500'>
              Total Monthly Budget:{" "}
              <span className='text-indigo-600 font-bold'>
                ${summary?.totalBudget}
              </span>
            </p>
          </div>
          <Button className='w-auto px-6'>Set New Budget</Button>
        </div>

        <div className='grid grid-cols-3 gap-6 mb-10'>
          {/* Status Card */}
          <div className='col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden'>
            <div className='flex justify-between items-center mb-6'>
              <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                Overall Status
              </span>
              <div className='bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full'>
                ↗ 8% Savings
              </div>
            </div>
            <h2 className='text-3xl font-bold mb-6'>On Track</h2>
            <ProgressBar
              progress={
                ((summary?.spent || 0) / (summary?.totalBudget || 1)) * 100
              }
            />
            <div className='grid grid-cols-4 gap-4 mt-8'>
              <div>
                <p className='text-xs text-gray-400'>Spent</p>
                <p className='font-bold'>${summary?.spent}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400'>Remaining</p>
                <p className='font-bold'>${summary?.remaining}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400'>Daily Limit</p>
                <p className='font-bold'>${summary?.dailyLimit}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400'>Days Left</p>
                <p className='font-bold'>{summary?.daysLeft}</p>
              </div>
            </div>
          </div>

          {/* Goal Card */}
          <div className='bg-indigo-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200'>
            <span className='text-xs font-bold opacity-70 uppercase tracking-wider'>
              Active Goal
            </span>
            <h2 className='text-2xl font-bold mt-2 mb-8'>{goal?.title}</h2>
            <div className='text-4xl font-bold mb-2'>
              ${goal?.current.toLocaleString()}
            </div>
            <p className='text-sm opacity-80'>
              Target: ${goal?.target.toLocaleString()}
            </p>
          </div>
        </div>

        <BudgetCategories data={categories} />
      </main>
    </div>
  );
};
