import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart } from "@/components/WeightChart";
import { GoalCard } from "@/components/GoalCard";
import { WeightInput } from "@/components/WeightInput";
import { WorkoutInput } from "@/components/WorkoutInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WorkoutData {
  pushups: number;
  situps: number;
  plankSeconds: number;
}

const Index = () => {
  const [weightData, setWeightData] = useState([
    { date: "2024-01-01", weight: 75 },
    { date: "2024-01-08", weight: 74.5 },
    { date: "2024-01-15", weight: 73.8 },
    { date: "2024-01-22", weight: 73.2 },
  ]);
  const [weightGoal, setWeightGoal] = useState(70);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const { toast } = useToast();

  const handleWeightSubmit = (weight: number) => {
    const today = new Date().toISOString().split("T")[0];
    setWeightData([...weightData, { date: today, weight }]);
  };

  const handleWorkoutSubmit = (workout: WorkoutData) => {
    setWorkouts([...workouts, workout]);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightGoal <= 0) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid weight goal",
        variant: "destructive",
      });
      return;
    }
    setIsEditingGoal(false);
    toast({
      title: "Goal updated",
      description: "Your weight goal has been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">Fitness Tracker</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {weightData[weightData.length - 1]?.weight || 0} kg
              </div>
              <WeightInput onWeightSubmit={handleWeightSubmit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Weight Goal
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                >
                  {isEditingGoal ? "Cancel" : "Edit"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingGoal ? (
                <form onSubmit={handleGoalSubmit} className="space-y-2">
                  <Input
                    type="number"
                    value={weightGoal}
                    onChange={(e) => setWeightGoal(Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                  <Button type="submit" className="w-full">
                    Save Goal
                  </Button>
                </form>
              ) : (
                <GoalCard
                  title="Progress to Goal"
                  current={weightData[weightData.length - 1]?.weight || 0}
                  target={weightGoal}
                  unit="kg"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutInput onWorkoutSubmit={handleWorkoutSubmit} />
            {workouts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Latest Workout</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Push-ups: {workouts[workouts.length - 1].pushups}</div>
                  <div>Sit-ups: {workouts[workouts.length - 1].situps}</div>
                  <div>Plank: {workouts[workouts.length - 1].plankSeconds}s</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;