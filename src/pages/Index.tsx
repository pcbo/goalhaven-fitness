import { useState, useEffect } from "react";
import { WeightTracker } from "@/components/WeightTracker";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { FastingTracker } from "@/components/FastingTracker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { differenceInMinutes } from "date-fns";

const Index = () => {
  const [weightData, setWeightData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [fastingSessions, setFastingSessions] = useState([]);
  const [isCurrentlyFasting, setIsCurrentlyFasting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWeights();
    fetchWorkouts();
    fetchFastingSessions();

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

    const fastingChannel = supabase
      .channel('fasting-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fasting_sessions' },
        () => {
          fetchFastingSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(weightsChannel);
      supabase.removeChannel(workoutsChannel);
      supabase.removeChannel(fastingChannel);
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

  const fetchFastingSessions = async () => {
    const { data, error } = await supabase
      .from('fasting_sessions')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching fasting sessions:', error);
      toast({
        title: "Error fetching fasting sessions",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFastingSessions(data);
    // Check if there's an ongoing session
    const lastSession = data[data.length - 1];
    setIsCurrentlyFasting(lastSession && !lastSession.end_time);
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

  const handleStartFasting = async () => {
    // Check if there's already an active session
    const currentSession = fastingSessions[fastingSessions.length - 1];
    if (currentSession && !currentSession.end_time) {
      toast({
        title: "Error starting fast",
        description: "You already have an active fasting session",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('fasting_sessions')
      .insert([{
        start_time: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error starting fasting session:', error);
      toast({
        title: "Error starting fasting session",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsCurrentlyFasting(true);
    await fetchFastingSessions(); // Refresh the data
  };

  const handleEndFasting = async () => {
    const currentSession = fastingSessions[fastingSessions.length - 1];
    
    if (!currentSession || currentSession.end_time) {
      toast({
        title: "Error ending fast",
        description: "No active fasting session found",
        variant: "destructive",
      });
      return;
    }

    const endTime = new Date();
    const startTime = new Date(currentSession.start_time);
    // Calculate duration including the full minute
    const durationMinutes = Math.ceil(differenceInMinutes(endTime, startTime));

    const { error } = await supabase
      .from('fasting_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq('id', currentSession.id);

    if (error) {
      console.error('Error ending fasting session:', error);
      toast({
        title: "Error ending fasting session",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsCurrentlyFasting(false);
    await fetchFastingSessions(); // Refresh the data
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">Welcome to Goal Haven</h1>
        <div className="grid gap-6">
          <FastingTracker 
            initialSessions={fastingSessions}
            onStartFasting={handleStartFasting}
            onEndFasting={handleEndFasting}
            isCurrentlyFasting={isCurrentlyFasting}
          />
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
