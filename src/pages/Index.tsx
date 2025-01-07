import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightInput } from "@/components/WeightInput";
import { WorkoutInput } from "@/components/WorkoutInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const { toast } = useToast();

  const handleWeightSubmit = (weight: number) => {
    const today = new Date().toISOString().split("T")[0];
    setWeightData([...weightData, { date: today, weight }]);
  };

  const handleWorkoutSubmit = (workout: WorkoutData) => {
    setWorkouts([...workouts, workout]);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">Fitness Tracker</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {weightData[weightData.length - 1]?.weight || 0} kg
                  </div>
                  {weightData.length > 1 && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      {getComparisonIcon(
                        weightData[weightData.length - 1]?.weight,
                        weightData[weightData.length - 2]?.weight
                      )}
                      vs previous: {weightData[weightData.length - 2]?.weight} kg
                    </div>
                  )}
                </div>
                <WeightInput onWeightSubmit={handleWeightSubmit} />
              </div>
              
              {weightData.length > 0 && (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Weight (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weightData.slice(-5).reverse().map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

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

                  <div className="mt-6 rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Push-ups</TableHead>
                          <TableHead>Sit-ups</TableHead>
                          <TableHead>Plank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workouts.slice(-5).reverse().map((workout, index) => (
                          <TableRow key={index}>
                            <TableCell>{workout.pushups}</TableCell>
                            <TableCell>{workout.situps}</TableCell>
                            <TableCell>{formatPlankTime(workout.plankSeconds)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;