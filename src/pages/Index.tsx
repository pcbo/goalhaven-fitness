import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalCard } from "@/components/GoalCard";
import { WeightInput } from "@/components/WeightInput";
import { WorkoutInput } from "@/components/WorkoutInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

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

  const getComparisonIcon = (current: number, previous: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getCurrentWorkout = () => workouts[workouts.length - 1];
  const getPreviousWorkout = () => workouts[workouts.length - 2];

  const formatPlankTime = (seconds: number) => {
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
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
            <CardTitle>Daily Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutInput onWorkoutSubmit={handleWorkoutSubmit} />
            {workouts.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Latest Workout</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Push-ups</span>
                      {getComparisonIcon(
                        getCurrentWorkout()?.pushups || 0,
                        getPreviousWorkout()?.pushups
                      )}
                    </div>
                    <p className="mt-1 text-2xl font-bold">{getCurrentWorkout()?.pushups || 0}</p>
                    {getPreviousWorkout() && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Previous: {getPreviousWorkout()?.pushups}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sit-ups</span>
                      {getComparisonIcon(
                        getCurrentWorkout()?.situps || 0,
                        getPreviousWorkout()?.situps
                      )}
                    </div>
                    <p className="mt-1 text-2xl font-bold">{getCurrentWorkout()?.situps || 0}</p>
                    {getPreviousWorkout() && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Previous: {getPreviousWorkout()?.situps}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plank</span>
                      {getComparisonIcon(
                        getCurrentWorkout()?.plankSeconds || 0,
                        getPreviousWorkout()?.plankSeconds
                      )}
                    </div>
                    <p className="mt-1 text-2xl font-bold">
                      {formatPlankTime(getCurrentWorkout()?.plankSeconds || 0)}
                    </p>
                    {getPreviousWorkout() && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Previous: {formatPlankTime(getPreviousWorkout()?.plankSeconds)}
                      </p>
                    )}
                  </div>
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
