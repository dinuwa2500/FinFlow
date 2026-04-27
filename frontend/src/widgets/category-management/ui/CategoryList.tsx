"use client";
import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Tag, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  Filter
} from "lucide-react";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { Category } from "@/entities/category/model/types";
import { CategoryModal } from "@/features/category-management/ui/CategoryModal";
import { confirmDialog, successToast, errorToast } from "@/shared/lib/swal";

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      errorToast("Error", "Could not load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    const result = await confirmDialog(
      "Delete Category?",
      `Are you sure you want to delete "${category.name}"? This might affect transactions using this category.`
    );

    if (result.isConfirmed) {
      try {
        await categoryApi.delete(category._id);
        successToast("Deleted!", `Category "${category.name}" has been removed.`);
        fetchCategories();
      } catch (error: any) {
        errorToast("Delete Failed", error?.response?.data?.error || "Could not delete category.");
      }
    }
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || cat.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your income and expense classification</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          New Category
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 border border-transparent focus:border-indigo-200 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-medium transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
            {[
                { id: "all", label: "All Types" },
                { id: "expense", label: "Expenses" },
                { id: "income", label: "Income" }
            ].map((f) => (
                <button
                    key={f.id}
                    onClick={() => setTypeFilter(f.id as any)}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        typeFilter === f.id 
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                        : "bg-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
      </div>

      {/* Category Grid/List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <div className="absolute inset-0 blur-lg bg-indigo-400/20 animate-pulse rounded-full" />
          </div>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Loading Categories...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 relative overflow-hidden"
            >
                {/* Decorative background circle */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150 ${cat.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${cat.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {cat.type === 'income' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${cat.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {cat.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {cat.name}
                  </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <Tag size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Categories Found</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                {searchQuery || typeFilter !== 'all' 
                    ? "Try adjusting your search or filters to find what you're looking for." 
                    : "You haven't created any categories yet. Start by adding your first one!"}
            </p>
            {!searchQuery && typeFilter === 'all' && (
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="mt-8 text-indigo-600 font-bold hover:underline"
                >
                    + Create your first category
                </button>
            )}
        </div>
      )}

      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};
