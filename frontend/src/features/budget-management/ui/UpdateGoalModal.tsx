"use client";
import { useState } from "react";
import { X, Target, TrendingUp } from "lucide-react";
import { goalApi, Goal } from "@/entities/goal/api/goalApi";

interface UpdateGoalModalProps {
  currentGoal: Goal;
  onClose: () => void;
  onUpdated: (goal: Goal) => void;
}

export const UpdateGoalModal = ({ currentGoal, onClose, onUpdated }: UpdateGoalModalProps) => {
  const [form, setForm] = useState<Goal>({ ...currentGoal });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = form.targetAmount > 0
    ? Math.min(100, (form.currentAmount / form.targetAmount) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.targetAmount <= 0) return setError("Please fill all fields correctly.");
    setIsLoading(true);
    setError("");
    try {
      const updated = await goalApi.update(form);
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update goal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Target size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Update Savings Goal</h2>
                <p className="text-xs opacity-70">Track your progress toward a target</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
          {/* Live Preview */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex justify-between text-xs opacity-80 mb-2">
              <span>{form.name || "Your Goal"}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="opacity-70">Saved: ${form.currentAmount.toLocaleString()}</span>
              <span className="font-bold">Target: ${form.targetAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Goal Name
            </label>
            <input
              type="text"
              placeholder="e.g. iPhone 17 Pro, Vacation, Emergency Fund"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 transition-all"
              required
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Target Amount ($)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={form.targetAmount || ""}
              onChange={(e) => setForm({ ...form, targetAmount: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 transition-all"
              required
            />
          </div>

          {/* Currently Collected */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Currently Collected ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.currentAmount || ""}
              onChange={(e) => setForm({ ...form, currentAmount: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 transition-all"
            />
            {form.targetAmount > 0 && (
              <p className="text-xs text-gray-400 mt-1 ml-1">
                ${Math.max(0, form.targetAmount - form.currentAmount).toLocaleString()} still needed
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Update Goal"}
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
      </div>
    </div>
  );
};
