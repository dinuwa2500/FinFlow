"use client";
import { AddTransactionForm } from "@/features/add-transaction/ui/AddTransactionForm";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

export const AddTransactionPage = () => {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center p-8'>
      <div className='w-full max-w-2xl'>
        <div className='mb-8 text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>Add Transaction</h1>
          <p className='text-gray-500'>
            Record your fiscal activity with precision.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-xl border border-gray-100'>
          <AddTransactionForm onCancel={() => router.back()} />
        </div>

        {/* Pro Tip Section */}
        <div className='mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start'>
          <div className='bg-indigo-100 p-1 rounded-full text-indigo-600'>
            <Info size={16} />
          </div>
          <div>
            <p className='text-sm font-bold text-indigo-900'>Pro Tip</p>
            <p className='text-xs text-indigo-700'>
              Attaching notes and categories helps our AI better predict your
              monthly spending trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
