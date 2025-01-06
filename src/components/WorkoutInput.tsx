import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkoutData {
  pushups: number;
  situps: number;
  plankSeconds: number;
}

interface WorkoutInputProps {
  onWorkoutSubmit: (workout: WorkoutData) => void;
}

export const WorkoutInput = ({ onWorkoutSubmit }: WorkoutInputProps) => {
  const [workout, setWorkout] = useState<WorkoutData>({
    pushups: 0,
    situps: 0,
    plankSeconds: 0,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workout.pushups < 0 || workout.situps < 0 || workout.plankSeconds < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
      return;
    }
    onWorkoutSubmit(workout);
    setWorkout({ pushups: 0, situps: 0, plankSeconds: 0 });
    toast({
      title: "Workout recorded",
      description: "Your workout has been recorded successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="pushups" className="text-sm font-medium">
            Push-ups
          </label>
          <Input
            id="pushups"
            type="number"
            value={workout.pushups}
            onChange={(e) =>
              setWorkout({ ...workout, pushups: parseInt(e.target.value) || 0 })
            }
            min="0"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="situps" className="text-sm font-medium">
            Sit-ups
          </label>
          <Input
            id="situps"
            type="number"
            value={workout.situps}
            onChange={(e) =>
              setWorkout({ ...workout, situps: parseInt(e.target.value) || 0 })
            }
            min="0"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="plank" className="text-sm font-medium">
            Plank (seconds)
          </label>
          <Input
            id="plank"
            type="number"
            value={workout.plankSeconds}
            onChange={(e) =>
              setWorkout({
                ...workout,
                plankSeconds: parseInt(e.target.value) || 0,
              })
            }
            min="0"
            className="mt-1"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Record Workout</Button>
    </form>
  );
};