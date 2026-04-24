"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Badge } from "@/shared/ui/Badge";
import { Plus, Trash2, Calendar, CreditCard, Loader2, DollarSign, RefreshCw } from "lucide-react";
import { subscriptionApi } from "@/entities/subscription/api/subscriptionApi";
import { Subscription } from "@/entities/subscription/model/types";

export const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    billingCycle: "monthly",
    category: "Entertainment",
    nextBillingDate: new Date().toISOString().split("T")[0],
  });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await subscriptionApi.create({
        ...formData,
        amount: Number(formData.amount),
      });
      setShowAddForm(false);
      setFormData({
        name: "",
        amount: "",
        billingCycle: "monthly",
        category: "Entertainment",
        nextBillingDate: new Date().toISOString().split("T")[0],
      });
      fetchSubscriptions();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        await subscriptionApi.delete(id);
        fetchSubscriptions();
      } catch (error) {
        console.error("Failed to delete subscription:", error);
      }
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header with Add Button */}
      <div className='flex justify-between items-center'>
        <div>
          <p className="text-gray-500 text-sm">Track and manage your recurring bills</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "primary"}
          className="flex items-center gap-2"
        >
          {showAddForm ? "Cancel" : <><Plus size={18} /> Add Subscription</>}
        </Button>
      </div>

      {/* Add Subscription Form */}
      {showAddForm && (
        <Card className="border-2 border-indigo-100 bg-indigo-50/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">New Subscription</h3>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Logo Preview */}
              <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-white border border-dashed border-gray-200 rounded-2xl w-full lg:w-40 shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 p-2">
                  {formData.name ? (
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${formData.name.toLowerCase().trim().replace(/\s+/g, '')}.com&sz=128`} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff&bold=true`;
                      }}
                    />
                  ) : (
                    <CreditCard size={32} className="text-gray-200" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Logo Preview</span>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 flex-1">
                <Input
                  label="Subscription Name"
                  placeholder="e.g. Spotify, YouTube, Netflix"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  icon={<CreditCard size={18} />}
                />
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  icon={<DollarSign size={18} />}
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-gray-700">Billing Cycle</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <Input
                  label="Next Billing Date"
                  type="date"
                  value={formData.nextBillingDate}
                  onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                  required
                  icon={<Calendar size={18} />}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : "Save Subscription"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Subscriptions Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-gray-500">Loading your subscriptions...</p>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {subscriptions.map((sub) => (
            <Card key={sub._id} className="hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(sub._id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 p-2 flex items-center justify-center shadow-sm">
                  <img src={sub.logo} alt={sub.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{sub.name}</h4>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{sub.category}</p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-gray-900">${sub.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <RefreshCw size={12} />
                    <span>Per {sub.billingCycle}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Next Bill</p>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">
                    <Calendar size={12} className="text-indigo-500" />
                    <span className="text-xs font-bold text-gray-700">
                      {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar for next payment logic could be here */}
              <div className="mt-6 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3 rounded-full"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <CreditCard size={24} className="text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-800">No subscriptions found</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
            Add your recurring payments like Netflix, Spotify, or Rent to track them here.
          </p>
          <Button 
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="mt-6"
          >
            Add your first subscription
          </Button>
        </Card>
      )}
    </div>
  );
};
