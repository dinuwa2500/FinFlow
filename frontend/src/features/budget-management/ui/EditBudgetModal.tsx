"use client";
import { useState } from "react";
import { X, Edit3, DollarSign, Trash2 } from "lucide-react";
import { budgetApi, BudgetProgress } from "@/entities/budget/api/budgetApi";

interface EditBudgetModalProps {
  budget: BudgetProgress;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export const EditBudgetModal = ({ budget, onClose, onUpdated, onDeleted }: EditBudgetModalProps) => {
  const [amount, setAmount] = useState(budget.budget.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return setError("Please enter a valid amount.");
    setIsLoading(true);
    setError("");
    try {
      await budgetApi.updateBudget(budget.id, parseFloat(amount));
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update budget.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await budgetApi.deleteBudget(budget.id);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete budget.");
      setIsDeleting(false);
    }
  };

  const percentUsed = parseFloat(budget.percentUsed);
  const newPercent = parseFloat(amount) > 0
    ? Math.min(100, (budget.spent / parseFloat(amount)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Edit3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Edit Budget</h2>
                <p className="text-xs opacity-70 capitalize">{budget.category}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Spent</p>
              <p className="text-base font-black text-gray-900">${budget.spent.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Budget</p>
              <p className="text-base font-black text-gray-900">${budget.budget.toLocaleString()}</p>
            </div>
            <div className={`rounded-2xl p-3 text-center ${budget.isExceeded ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className="text-[10px] uppercase font-bold tracking-wider mb-1 text-gray-400">Used</p>
              <p className={`text-base font-black ${budget.isExceeded ? 'text-red-600' : 'text-green-600'}`}>
                {percentUsed.toFixed(0)}%
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                New Budget Limit
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 transition-all"
                  required
                />
              </div>
              {parseFloat(amount) > 0 && (
                <p className={`text-xs mt-1 ml-1 font-medium ${newPercent > 90 ? 'text-red-500' : 'text-green-600'}`}>
                  With this limit, you've used {newPercent.toFixed(0)}% of your budget
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Update Limit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 text-sm font-bold py-2 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={16} /> Delete This Budget
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm font-bold text-red-700 mb-3 text-center">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Keep It
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
