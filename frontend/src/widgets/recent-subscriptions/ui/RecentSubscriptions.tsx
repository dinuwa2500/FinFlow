"use client";
import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/Card";
import { subscriptionApi } from "@/entities/subscription/api/subscriptionApi";
import { Subscription } from "@/entities/subscription/model/types";
import { Calendar, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export const RecentSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await subscriptionApi.getRecent();
        setSubscriptions(data);
      } catch (error) {
        console.error("Failed to fetch recent subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className='font-bold text-gray-800'>Recent Subscriptions</h3>
        <Link 
          href="/dashboard/subscriptions" 
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition-colors"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className='space-y-4'>
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div
              key={sub._id}
              className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center p-2 border border-gray-100 shadow-sm shrink-0'>
                  <img 
                    src={sub.logo} 
                    alt={sub.name} 
                    className='w-full h-full object-contain' 
                  />
                </div>
                <div className="min-w-0">
                  <p className='text-sm font-bold text-gray-800 truncate'>{sub.name}</p>
                  <p className='text-[10px] text-gray-400 font-medium'>
                    Next: {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className='text-sm font-bold text-gray-800'>${sub.amount.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 capitalize">{sub.billingCycle}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CreditCard size={24} className="text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">No active subscriptions</p>
          </div>
        )}
      </div>
    </Card>
  );
};
