"use client";
import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/Card";
import { Filter, ChevronDown, Trash2 } from "lucide-react";
import { brandApi } from "@/entities/brand/api/brandApi";
import { fetchRecentExpenses } from "@/entities/transaction/api/transactionApi";

import { RecentSubscriptions } from "@/widgets/recent-subscriptions/ui/RecentSubscriptions";

export const TransactionManagement = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [brandRes, transRes] = await Promise.all([
          brandApi.getAllBrands(),
          fetchRecentExpenses()
        ]);

        if (brandRes.success) {
          setBrands(brandRes.data);
        }
        
        // Assuming transRes returns { success: true, data: [...] } or just [...]
        const transData = transRes.data || transRes;
        setTransactions(transData || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getLogo = (title: string) => {
    // Try to find a brand that matches the title (e.g. "Amazon Order" -> "Amazon")
    const brand = brands.find(b => title.toLowerCase().includes(b.name.toLowerCase()));
    return brand ? brand.logoUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random`;
  };

  const getBrandName = (title: string) => {
    const brand = brands.find(b => title.toLowerCase().includes(b.name.toLowerCase()));
    return brand ? brand.name : title;
  };

  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2 h-96 animate-pulse bg-gray-50 flex items-center justify-center text-gray-400'>
          Loading transactions...
        </Card>
        <div className="h-96 animate-pulse bg-gray-50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Transactions Table */}
      <Card className='lg:col-span-2'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-gray-800'>Recent Transactions</h3>
          <div className='flex gap-2'>
            <button className='flex items-center gap-2 text-xs font-medium border border-border px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm'>
              <Filter size={14} className="text-gray-500" />
              Filter
            </button>
            <button className='flex items-center gap-2 text-xs font-medium border border-border px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm'>
              All Activity
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='text-gray-400 border-b'>
                <th className='pb-3 font-medium'>Details</th>
                <th className='pb-3 font-medium'>Amount</th>
                <th className='pb-3 font-medium'>Category</th>
                <th className='pb-3 font-medium'>Date</th>
                <th className='pb-3 font-medium text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? recentTransactions.map((t) => (
                <tr
                  key={t._id}
                  className='border-b last:border-0 hover:bg-gray-50/50 transition-colors group'
                >
                  <td className='py-4 text-gray-800 font-medium flex items-center gap-2'>
                    <div className={`w-8 h-8 rounded-lg overflow-hidden border p-1 flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-success/10 border-success/20' : 'bg-white border-gray-100'}`}>
                      {t.type === 'income' ? (
                        <div className="text-success font-bold text-lg leading-none mt-[-2px]">$</div>
                      ) : (
                        <img src={getLogo(t.title)} alt={t.title} className="w-full h-full object-contain" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[150px]">{getBrandName(t.title)}</span>
                      <span className={`text-[10px] font-semibold uppercase tracking-tighter ${t.type === 'income' ? 'text-success' : 'text-gray-400'}`}>
                        {t.type}
                      </span>
                    </div>
                  </td>
                  <td className={`py-4 font-bold ${t.type === 'income' ? 'text-success' : 'text-slate-900'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='py-4 text-gray-500'>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      {t.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className='py-4 text-gray-400 whitespace-nowrap text-xs'>
                    {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className='py-4 text-right'>
                    <button 
                      onClick={() => {
                        if(confirm('Delete this transaction?')) {
                          setTransactions(prev => prev.filter(item => item._id !== t._id));
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">No recent activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* NEW SUBSCRIPTIONS WIDGET */}
      <RecentSubscriptions />
    </div>
  );
};
