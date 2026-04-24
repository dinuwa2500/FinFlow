"use client";
import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/Card";
import {
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  MoreVertical,
  TrendingDown,
  CreditCard,
} from "lucide-react";
import { transactionApi } from "@/entities/transaction/api/transactionApi";
import { goalApi, Goal } from "@/entities/goal/api/goalApi";
import { GoalModal } from "@/features/goal-setting/ui/GoalModal";

export const StatsGrid = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeGrowth: 0,
    expenseGrowth: 0,
  });
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const [summaryData, goalData] = await Promise.all([
          transactionApi.getSummary(now.getMonth() + 1, now.getFullYear()),
          goalApi.get(),
        ]);
        setSummary(summaryData);
        setGoal(goalData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
      {/* Account Balance */}
      <Card theme='default'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <Wallet className='text-primary' size={18} />
            <span className='text-sm font-semibold'>Account Balance</span>
          </div>
          <MoreVertical className='text-muted-foreground' size={16} />
        </div>
        <div className='text-2xl font-bold mb-4'>
          ${summary.balance.toFixed(2)}
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-1 text-success text-xs font-medium bg-success/10 px-2 py-1 rounded'>
            <TrendingUp size={12} /> Live Tracking
          </div>
        </div>
      </Card>

      {/* Monthly Expenses */}
      <Card theme='danger'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <PieChart className='text-danger' size={18} />
            <span className='text-sm font-semibold text-danger'>
              Monthly Expenses
            </span>
          </div>
          <MoreVertical className='text-muted-foreground' size={16} />
        </div>
        <div className='text-2xl font-bold mb-4 text-foreground'>
          ${summary.totalExpenses.toFixed(2)}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded w-fit ${summary.expenseGrowth >= 0 ? "text-danger bg-danger/10" : "text-success bg-success/10"}`}
        >
          {summary.expenseGrowth >= 0 ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {Math.abs(summary.expenseGrowth).toFixed(1)}%{" "}
          {summary.expenseGrowth >= 0 ? "increase" : "decrease"}
        </div>
      </Card>

      {/* Monthly Income */}
      <Card theme='primary'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='text-primary' size={18} />
            <span className='text-sm font-semibold text-primary'>
              Monthly Income
            </span>
          </div>
          <MoreVertical className='text-muted-foreground' size={16} />
        </div>
        <div className='text-2xl font-bold text-foreground mb-4'>
          ${summary.totalIncome.toFixed(2)}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded w-fit ${summary.incomeGrowth >= 0 ? "text-success bg-success/10" : "text-danger bg-danger/10"}`}
        >
          {summary.incomeGrowth >= 0 ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {Math.abs(summary.incomeGrowth).toFixed(1)}%{" "}
          {summary.incomeGrowth >= 0 ? "more" : "less"}
        </div>
      </Card>

      {/* Goal */}
      <Card 
        theme='warning' 
        className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
        onClick={() => setIsGoalModalOpen(true)}
      >
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <Target className='text-warning' size={18} />
            <span className='text-sm font-semibold text-warning'>Goal</span>
          </div>
          <MoreVertical className='text-muted-foreground' size={16} />
        </div>
        <div className='flex items-center gap-4'>
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14" viewBox="0 0 100 100">
              <circle
                className="text-warning/20"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-warning transition-all duration-1000 ease-in-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * (goal ? Math.min(goal.currentAmount / goal.targetAmount, 1) : 0))}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
              {goal ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0}%
            </div>
          </div>
          <div className="min-w-0">
            <div className='text-sm font-bold text-foreground truncate'>
              {goal?.name || 'Loading...'}
            </div>
            <div className='text-[10px] text-muted-foreground mt-1'>
              <div>Required: ${goal?.targetAmount.toLocaleString() || '0'}</div>
              <div className='text-foreground font-medium'>Collect: ${goal?.currentAmount.toLocaleString() || '0'}</div>
            </div>
          </div>
        </div>
      </Card>

      {isGoalModalOpen && goal && (
        <GoalModal 
          initialGoal={goal} 
          onClose={() => setIsGoalModalOpen(false)} 
          onUpdate={(updated) => setGoal(updated)}
        />
      )}
    </div>
  );
};
