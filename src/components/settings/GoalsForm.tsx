import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GoalInput } from "./GoalInput";
import { useFitnessGoals } from "@/hooks/use-fitness-goals";

export const GoalsForm = () => {
  const { toast } = useToast();
  const { goals, updateGoal } = useFitnessGoals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Goals updated",
      description: "Your fitness goals have been saved successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <GoalInput
          label="Fasting Target (hours)"
          value={goals.fastingHours}
          onChange={(value) => updateGoal('fastingHours', value)}
          min={1}
          max={24}
        />
        
        <div className="grid gap-4 md:grid-cols-3">
          <GoalInput
            label="Target Weight (kg)"
            value={goals.targetWeight}
            onChange={(value) => updateGoal('targetWeight', value)}
            step={0.1}
          />
          <GoalInput
            label="Target Fat %"
            value={goals.targetFatPercentage}
            onChange={(value) => updateGoal('targetFatPercentage', value)}
            min={0}
            max={100}
            step={0.1}
          />
          <GoalInput
            label="Target Muscle %"
            value={goals.targetMusclePercentage}
            onChange={(value) => updateGoal('targetMusclePercentage', value)}
            min={0}
            max={100}
            step={0.1}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GoalInput
            label="Target Push-ups"
            value={goals.targetPushups}
            onChange={(value) => updateGoal('targetPushups', value)}
          />
          <GoalInput
            label="Target Sit-ups"
            value={goals.targetSitups}
            onChange={(value) => updateGoal('targetSitups', value)}
          />
          <GoalInput
            label="Target Plank (minutes)"
            value={goals.targetPlankMinutes}
            onChange={(value) => updateGoal('targetPlankMinutes', value)}
            step={0.5}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Save Goals</Button>
    </form>
  );
};