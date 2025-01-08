import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutInput } from "@/components/WorkoutInput";
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
  date: string;
  pushups: number;
  situps: number;
  plankSeconds: number;
}

interface WorkoutTrackerProps {
  initialWorkouts: WorkoutData[];
  onWorkoutSubmit: (workout: Omit<WorkoutData, "date">) => void;
}

export const WorkoutTracker = ({ initialWorkouts, onWorkoutSubmit }: WorkoutTrackerProps) => {
  const getComparisonIcon = (current: number, previous: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getCurrentWorkout = () => initialWorkouts[initialWorkouts.length - 1];
  const getPreviousWorkout = () => initialWorkouts[initialWorkouts.length - 2];

  const formatPlankTime = (seconds: number) => {
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkoutInput onWorkoutSubmit={onWorkoutSubmit} />
        {initialWorkouts.length > 0 && (
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
                    <TableHead>Date</TableHead>
                    <TableHead>Push-ups</TableHead>
                    <TableHead>Sit-ups</TableHead>
                    <TableHead>Plank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialWorkouts.slice(-5).reverse().map((workout, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(workout.date)}</TableCell>
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
  );
};