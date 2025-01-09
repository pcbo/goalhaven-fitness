import { useState, useEffect } from "react";
import { WeightTracker } from "@/components/WeightTracker";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [weightData, setWeightData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchWeights();
    fetchWorkouts();

    // Set up real-time subscriptions
    const weightsChannel = supabase
      .channel('weights-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weights' },
        () => {
          fetchWeights();
        }
      )
      .subscribe();

    const workoutsChannel = supabase
      .channel('workouts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workouts' },
        () => {
          fetchWorkouts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(weightsChannel);
      supabase.removeChannel(workoutsChannel);
    };
  }, []);

  const fetchWeights = async () => {
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching weights:', error);
      toast({
        title: "Error fetching weights",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setWeightData(data);
  };

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching workouts:', error);
      toast({
        title: "Error fetching workouts",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const formattedWorkouts = data.map(workout => ({
      date: workout.date,
      pushups: workout.pushups,
      situps: workout.situps,
      plankSeconds: workout.plank_seconds,
    }));

    setWorkouts(formattedWorkouts);
  };

  const handleWeightSubmit = async (weight: number) => {
    const { error } = await supabase
      .from('weights')
      .insert([{ weight }]);

    if (error) {
      console.error('Error inserting weight:', error);
      toast({
        title: "Error saving weight",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleWorkoutSubmit = async (workout: {
    pushups: number;
    situps: number;
    plankSeconds: number;
  }) => {
    const { error } = await supabase
      .from('workouts')
      .insert([{
        pushups: workout.pushups,
        situps: workout.situps,
        plank_seconds: workout.plankSeconds,
      }]);

    if (error) {
      console.error('Error inserting workout:', error);
      toast({
        title: "Error saving workout",
        description: error.message,
        variant: "destructive",
      });
    }
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