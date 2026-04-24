"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Toggle } from "@/shared/ui/Toggle";
import { transactionApi } from "@/entities/transaction/api/transactionApi";
import { TransactionData } from "@/entities/transaction/model/types";
import { categoryApi } from "@/entities/category/api/categoryApi";
import { Category } from "@/entities/category/model/types";
import { LayoutGrid } from "lucide-react";

export const AddTransactionForm = ({ onCancel }: { onCancel: () => void }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionData>({
    defaultValues: { 
      type: "expense",
      date: new Date().toISOString().split('T')[0]
    },
  });

  const currentType = watch("type");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll(currentType);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [currentType]);

  const onSubmit = async (data: TransactionData) => {
    setIsLoading(true);
    try {
      await transactionApi.create({
        ...data,
        amount: Number(data.amount), 
        date: new Date(data.date).toISOString(), 
      });
      alert("Transaction saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to save transaction. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Transaction Type */}
      <div className='space-y-2'>
        <label className='text-sm font-semibold text-gray-700'>
          Transaction Type
        </label>
        <Toggle
          options={[
            { label: "Expense", value: "expense" },
            { label: "Income", value: "income" },
          ]}
          value={currentType}
          onChange={(val) => {
            setValue("type", val as any);
            setValue("category", ""); 
          }}
        />
      </div>

      {/* Title */}
      <Input
        label='Title'
        placeholder='e.g. Monthly Grocery Run'
        {...register("title", { required: "Title is required" })}
        error={errors.title?.message}
      />

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Amount ($)'
          type='number'
          step="0.01"
          placeholder='0.00'
          {...register("amount", { required: "Amount is required" })}
          error={errors.amount?.message}
        />
        <Input
          label='Date'
          type='date'
          {...register("date", { required: "Date is required" })}
          error={errors.date?.message}
        />
      </div>

      {/* Category Select */}
      <div className='space-y-2'>
        <label className='text-sm font-semibold text-gray-700'>Category</label>
        <div className='relative'>
          <LayoutGrid
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={18}
          />
          <select
            {...register("category", { required: "Category is required" })}
            className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all'
          >
            <option value=''>Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
            ▾
          </div>
        </div>
        {errors.category && (
          <span className='text-xs text-red-500'>
            {errors.category.message}
          </span>
        )}
      </div>

      {/* Note */}
      <div className='space-y-2'>
        <label className='text-sm font-semibold text-gray-700'>
          Optional Note
        </label>
        <textarea
          {...register("note")}
          placeholder='Add additional details about this transaction...'
          className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all'
        />
      </div>

      <div className='flex items-center gap-4 pt-4'>
        <Button type='submit' isLoading={isLoading}>
          Save Transaction
        </Button>
        <button
          type='button'
          onClick={onCancel}
          className='px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
