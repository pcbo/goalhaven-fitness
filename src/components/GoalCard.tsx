import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
}

export const GoalCard = ({ title, current, target, unit }: GoalCardProps) => {
  const calculateProgress = () => {
    // If we're trying to lose weight (current > target)
    if (current > target) {
      const totalWeightToLose = current - target;
      const weightLost = 0; // Since we're above target, we haven't lost any weight yet
      return Math.max(0, (weightLost / totalWeightToLose) * 100);
    }
    // If we're trying to gain weight (current < target)
    else {
      const totalWeightToGain = target - current;
      const weightGained = current - target + totalWeightToGain;
      return Math.min(100, (weightGained / totalWeightToGain) * 100);
    }
  };

  const getRemainingText = () => {
    const difference = Math.abs(current - target);
    if (current === target) return "Goal reached!";
    return `${difference.toFixed(1)}${unit} to ${current > target ? "lose" : "gain"}`;
  };

  return (
    <div className="space-y-2">
      <Progress value={calculateProgress()} className="h-2" />
      <p className="text-sm text-muted-foreground">{getRemainingText()}</p>
    </div>
  );
};