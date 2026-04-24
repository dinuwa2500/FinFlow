"use client";
import { useState } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { goalApi, Goal } from "@/entities/goal/api/goalApi";
import { Target, X } from "lucide-react";

interface GoalModalProps {
  initialGoal: Goal;
  onClose: () => void;
  onUpdate: (updated: Goal) => void;
}

export const GoalModal = ({ initialGoal, onClose, onUpdate }: GoalModalProps) => {
  const [formData, setFormData] = useState<Goal>(initialGoal);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await goalApi.update(formData);
      onUpdate(updated);
      onClose();
    } catch (error) {
      alert("Failed to update goal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-xl text-warning">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Set Financial Goal</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. Apple iPhone 17 Pro"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Target Amount ($)"
            type="number"
            placeholder="0.00"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
            required
          />
          <Input
            label="Currently Collected ($)"
            type="number"
            placeholder="0.00"
            value={formData.currentAmount}
            onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
            required
          />

          <div className="pt-4 flex gap-3">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Save Goal
            </Button>
            <Button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
