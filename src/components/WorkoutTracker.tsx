import { CardContent } from "@/components/ui/card";
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
  plank_seconds: number;
}

interface WorkoutTrackerProps {
  initialWorkouts: WorkoutData[];
  onWorkoutSubmit: (workout: { pushups: number; situps: number; plankSeconds: number }) => void;
}

export const WorkoutTracker = ({ initialWorkouts, onWorkoutSubmit }: WorkoutTrackerProps) => {
  const getComparisonIcon = (current: number, previous: number) => {
    if (!previous) {
      return current > 0 
        ? <ArrowUp className="h-4 w-4 text-green-500" />
        : <Minus className="h-4 w-4 text-gray-500" />;
    }
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getCurrentWorkout = () => initialWorkouts[initialWorkouts.length - 1];
  const getPreviousWorkout = () => initialWorkouts[initialWorkouts.length - 2];

  const formatPlankTime = (seconds: number | null | undefined): string => {
    if (!seconds || isNaN(seconds)) return '0m';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-background rounded-lg">
      <CardContent className="px-0">
        <WorkoutInput onWorkoutSubmit={onWorkoutSubmit} />
        {initialWorkouts.length > 0 && (
          <div className="mt-4 space-y-4">
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
                    getCurrentWorkout()?.plank_seconds || 0,
                    getPreviousWorkout()?.plank_seconds
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {formatPlankTime(getCurrentWorkout()?.plank_seconds)}
                </p>
                {getPreviousWorkout() && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {formatPlankTime(getPreviousWorkout()?.plank_seconds)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
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
                      <TableCell>{formatPlankTime(workout.plank_seconds)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
};