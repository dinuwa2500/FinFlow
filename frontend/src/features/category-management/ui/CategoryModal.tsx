"use client";
import { useEffect, useState } from "react";
import { X, PlusCircle, Tag, Layers, Check } from "lucide-react";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { Category } from "@/entities/category/model/types";
import { successToast, errorToast } from "@/shared/lib/swal";

interface CategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null; // If provided, we are editing
}

export const CategoryModal = ({ onClose, onSuccess, category }: CategoryModalProps) => {
  const [name, setName] = useState(category?.name || "");
  const [type, setType] = useState<'income' | 'expense'>(category?.type as any || "expense");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return setError("Please enter a category name.");
    
    setIsLoading(true);
    setError("");
    
    try {
      if (isEditing && category?._id) {
        await categoryApi.update(category._id, { name, type });
        successToast("Category Updated!", `"${name}" has been updated.`);
      } else {
        await categoryApi.create({ name, type });
        successToast("Category Created!", `"${name}" is ready to use.`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "An error occurred.");
      errorToast("Failed to save", err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Tag size={120} />
            </div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                {isEditing ? <Check size={24} /> : <PlusCircle size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-bold">{isEditing ? "Edit Category" : "Add Category"}</h2>
                <p className="text-sm opacity-80">{isEditing ? "Modify category details" : "Create a new spending or income tag"}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all hover:rotate-90">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
              Category Name
            </label>
            <div className="relative group">
              <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="e.g. Shopping, Salary, Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  type === "expense"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  type === "income"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <div className="w-1 h-1 bg-red-600 rounded-full" />
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isEditing ? "Save Changes" : "Create Category"}
                  <Layers size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
