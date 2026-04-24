"use client";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { ChevronDown } from "lucide-react";

import { useEffect, useState } from "react";
import { transactionApi } from "@/entities/transaction/api/transactionApi";

export const ExpenseAnalytics = () => {
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [history, stats] = await Promise.all([
          transactionApi.getHistory(),
          transactionApi.getCategoryStats()
        ]);
        setBarData(history);
        setPieData(stats);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="h-80 animate-pulse bg-gray-50 flex items-center justify-center text-gray-400">Loading charts...</Card>
        <Card className="h-80 animate-pulse bg-gray-50 flex items-center justify-center text-gray-400">Loading details...</Card>
      </div>
    );
  }
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
      {/* Monthly Expenses Bar Chart */}
      <Card className='flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-gray-800'>Monthly Trend</h3>
          <div className='flex items-center gap-2'>
            <Badge type='success'>Inflow / Outflow</Badge>
          </div>
        </div>
        <div className='h-64 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData}>
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <Bar
                dataKey='income'
                fill='#10b981'
                radius={[15, 15, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey='expense'
                fill='#6366f1'
                radius={[15, 15, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Category Donut Chart */}
      <Card className='flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-gray-800'>Top Category</h3>
          <button className='flex items-center gap-2 text-xs font-semibold border border-border px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm'>
            Most Spent
          </button>
        </div>
        <div className='flex items-center justify-around flex-col sm:flex-row'>
          <div className='h-48 w-48'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='space-y-3 mt-4 sm:mt-0'>
            {pieData.map((item, index) => (
              <div
                key={item.name}
                className='flex justify-between text-xs w-48'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                  />
                  <span className='text-gray-600 font-medium'>{item.name}</span>
                </div>
                <span className='font-bold text-gray-800'>
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
