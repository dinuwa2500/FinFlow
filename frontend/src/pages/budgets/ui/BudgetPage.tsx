"use client";
import { useCallback, useEffect, useState } from "react";
import { budgetApi, BudgetProgress } from "@/entities/budget/api/budgetApi";
import { goalApi, Goal } from "@/entities/goal/api/goalApi";
import { BudgetCategories } from "@/widgets/budget-categories/ui/BudgetCategories";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { Target, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { SetBudgetModal } from "@/features/budget-management/ui/SetBudgetModal";
import { UpdateGoalModal } from "@/features/budget-management/ui/UpdateGoalModal";
import { EditBudgetModal } from "@/features/budget-management/ui/EditBudgetModal";

export const BudgetPage = () => {
  const [budgets, setBudgets] = useState<BudgetProgress[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [isUpdateGoalOpen, setIsUpdateGoalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(null);

  const now = new Date();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bData, gData] = await Promise.all([
        budgetApi.getBudgets(now.getMonth() + 1, now.getFullYear()),
        goalApi.get(),
      ]);
      setBudgets(bData);
      setGoal(gData);
    } catch (error) {
      console.error("Failed to load budget data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overallPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const exceededCount = budgets.filter((b) => b.isExceeded).length;

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <p className="text-sm text-gray-500">
                Total:{" "}
                <span className="text-black font-bold">${totalBudget.toLocaleString()}</span>
              </p>
              <div className="h-4 w-px bg-gray-200" />
              <p className="text-sm text-gray-500">
                Month:{" "}
                <span className="text-black font-bold capitalize">
                  {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
                </span>
              </p>
              {exceededCount > 0 && (
                <>
                  <div className="h-4 w-px bg-gray-200" />
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {exceededCount} budget{exceededCount > 1 ? "s" : ""} exceeded
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsSetBudgetOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-200 text-sm"
          >
            <Plus size={18} /> Set New Budget
          </button>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <span className="text-sm text-gray-400 font-medium">Loading budget analysis...</span>
            </div>
          </div>
        ) : (
          <>
            {/* ── Top Cards ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Overall Status */}
              <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={14} /> Monthly Overview
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      overallPercent > 90
                        ? "bg-red-100 text-red-600"
                        : overallPercent > 70
                        ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {overallPercent > 100
                      ? "Limit Exceeded"
                      : `${(100 - overallPercent).toFixed(1)}% remaining`}
                  </span>
                </div>
                <h2 className="text-3xl font-black mb-1 text-gray-900">
                  {overallPercent > 95
                    ? "⚠ Watch Your Spending"
                    : overallPercent > 70
                    ? "Getting Close"
                    : "On Track 👍"}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  ${totalSpent.toLocaleString()} spent of ${totalBudget.toLocaleString()} total budget
                </p>
                <ProgressBar
                  progress={overallPercent}
                  color={
                    overallPercent > 90 ? "danger" : overallPercent > 70 ? "primary" : "success"
                  }
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: "Spent", value: `$${totalSpent.toLocaleString()}` },
                    {
                      label: "Remaining",
                      value: `$${Math.max(0, totalBudget - totalSpent).toLocaleString()}`,
                    },
                    {
                      label: "Daily Avg",
                      value: `$${(totalSpent / now.getDate()).toFixed(2)}`,
                    },
                    { label: "Days Left", value: daysLeft.toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        {label}
                      </p>
                      <p className="text-lg font-black text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 flex flex-col">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold opacity-70 uppercase tracking-wider flex items-center gap-2">
                    <Target size={13} /> Savings Goal
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {goal ? `${Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))}%` : "—"}
                  </span>
                </div>
                <h2 className="text-lg font-black mt-3 leading-tight">
                  {goal?.name || "No Goal Set"}
                </h2>

                <div className="flex-1 flex flex-col justify-end mt-6">
                  {goal && (
                    <>
                      {/* Progress Ring */}
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-5">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="opacity-70">Saved</span>
                        <span className="font-bold">${goal.currentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-6">
                        <span className="opacity-70">Target</span>
                        <span className="font-bold">${goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="text-xs bg-white/10 rounded-xl px-3 py-2 text-center font-medium mb-3">
                        ${Math.max(0, goal.targetAmount - goal.currentAmount).toLocaleString()} still needed
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => setIsUpdateGoalOpen(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold"
                  >
                    {goal ? "Update Goal" : "Set a Goal"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Categories List ── */}
            <BudgetCategories
              data={budgets}
              onEdit={(budget) => setEditingBudget(budget)}
            />
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {isSetBudgetOpen && (
        <SetBudgetModal
          onClose={() => setIsSetBudgetOpen(false)}
          onCreated={fetchData}
        />
      )}

      {isUpdateGoalOpen && goal && (
        <UpdateGoalModal
          currentGoal={goal}
          onClose={() => setIsUpdateGoalOpen(false)}
          onUpdated={(updated) => setGoal(updated)}
        />
      )}

      {/* If no goal yet, open a blank update goal form */}
      {isUpdateGoalOpen && !goal && (
        <UpdateGoalModal
          currentGoal={{ name: "", targetAmount: 0, currentAmount: 0 }}
          onClose={() => setIsUpdateGoalOpen(false)}
          onUpdated={(updated) => setGoal(updated)}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onUpdated={fetchData}
          onDeleted={fetchData}
        />
      )}
    </DashboardLayout>
  );
};
