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
    { date: "2024-01-01", weight: 75 },
    { date: "2024-01-08", weight: 74.5 },
    { date: "2024-01-15", weight: 73.8 },
    { date: "2024-01-22", weight: 73.2 },
  ]);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([
    { date: "2024-01-01", pushups: 20, situps: 30, plankSeconds: 60 },
    { date: "2024-01-08", pushups: 22, situps: 32, plankSeconds: 70 },
    { date: "2024-01-15", pushups: 25, situps: 35, plankSeconds: 80 },
    { date: "2024-01-22", pushups: 27, situps: 37, plankSeconds: 90 },
  ]);
  const { toast } = useToast();

  const handleWeightSubmit = (weight: number) => {
    const today = new Date().toISOString().split("T")[0];
    setWeightData([...weightData, { date: today, weight }]);
  };

  const handleWorkoutSubmit = (workout: Omit<WorkoutData, "date">) => {
    const today = new Date().toISOString().split("T")[0];
    setWorkouts([...workouts, { ...workout, date: today }]);
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