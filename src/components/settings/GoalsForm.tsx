import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Goals {
  fastingHours: number;
  targetWeight: number;
  targetFatPercentage: number;
  targetMusclePercentage: number;
  targetPushups: number;
  targetSitups: number;
  targetPlankMinutes: number;
  targetReadingStreak: number;
}

export const GoalsForm = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goals>(() => {
    const savedGoals = localStorage.getItem('fitness-goals');
    return savedGoals ? JSON.parse(savedGoals) : {
      fastingHours: 16,
      targetWeight: 0,
      targetFatPercentage: 0,
      targetMusclePercentage: 0,
      targetPushups: 0,
      targetSitups: 0,
      targetPlankMinutes: 0,
      targetReadingStreak: 0,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fitness-goals', JSON.stringify(goals));
    toast({
      title: "Goals updated",
      description: "Your fitness goals have been saved successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fastingHours">Fasting Target (hours)</Label>
          <Input
            id="fastingHours"
            type="number"
            value={goals.fastingHours}
            onChange={(e) =>
              setGoals({ ...goals, fastingHours: Number(e.target.value) })
            }
            min="1"
            max="24"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              value={goals.targetWeight}
              onChange={(e) =>
                setGoals({ ...goals, targetWeight: Number(e.target.value) })
              }
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="targetFat">Target Fat %</Label>
            <Input
              id="targetFat"
              type="number"
              value={goals.targetFatPercentage}
              onChange={(e) =>
                setGoals({ ...goals, targetFatPercentage: Number(e.target.value) })
              }
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="targetMuscle">Target Muscle %</Label>
            <Input
              id="targetMuscle"
              type="number"
              value={goals.targetMusclePercentage}
              onChange={(e) =>
                setGoals({ ...goals, targetMusclePercentage: Number(e.target.value) })
              }
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="targetPushups">Target Push-ups</Label>
            <Input
              id="targetPushups"
              type="number"
              value={goals.targetPushups}
              onChange={(e) =>
                setGoals({ ...goals, targetPushups: Number(e.target.value) })
              }
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="targetSitups">Target Sit-ups</Label>
            <Input
              id="targetSitups"
              type="number"
              value={goals.targetSitups}
              onChange={(e) =>
                setGoals({ ...goals, targetSitups: Number(e.target.value) })
              }
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="targetPlank">Target Plank (minutes)</Label>
            <Input
              id="targetPlank"
              type="number"
              value={goals.targetPlankMinutes}
              onChange={(e) =>
                setGoals({ ...goals, targetPlankMinutes: Number(e.target.value) })
              }
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="targetReadingStreak">Target Reading Streak (days)</Label>
          <Input
            id="targetReadingStreak"
            type="number"
            value={goals.targetReadingStreak}
            onChange={(e) =>
              setGoals({ ...goals, targetReadingStreak: Number(e.target.value) })
            }
            min="0"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Save Goals</Button>
    </form>
  );
};