import { useState } from "react";
import { WeightTracker } from "@/components/WeightTracker";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { useToast } from "@/hooks/use-toast";

interface WorkoutData {
  date: string;
  pushups: number;
  situps: number;
  plankSeconds: number;
}

const Index = () => {
  const [weightData, setWeightData] = useState([
    { date: "2024-01-01T10:30:00", weight: 75 },
    { date: "2024-01-08T11:15:00", weight: 74.5 },
    { date: "2024-01-15T09:45:00", weight: 73.8 },
    { date: "2024-01-22T14:20:00", weight: 73.2 },
  ]);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([
    { date: "2024-01-01T08:00:00", pushups: 20, situps: 30, plankSeconds: 60 },
    { date: "2024-01-08T09:30:00", pushups: 22, situps: 32, plankSeconds: 70 },
    { date: "2024-01-15T11:15:00", pushups: 25, situps: 35, plankSeconds: 80 },
    { date: "2024-01-22T15:45:00", pushups: 27, situps: 37, plankSeconds: 90 },
  ]);
  const { toast } = useToast();

  const handleWeightSubmit = (weight: number) => {
    const now = new Date();
    setWeightData([...weightData, { date: now.toISOString(), weight }]);
  };

  const handleWorkoutSubmit = (workout: Omit<WorkoutData, "date">) => {
    const now = new Date();
    setWorkouts([...workouts, { ...workout, date: now.toISOString() }]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">Fitness Tracker</h1>
        
        <div className="grid gap-6">
          <WeightTracker 
            initialWeightData={weightData} 
            onWeightSubmit={handleWeightSubmit} 
          />
          <WorkoutTracker 
            initialWorkouts={workouts} 
            onWorkoutSubmit={handleWorkoutSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;