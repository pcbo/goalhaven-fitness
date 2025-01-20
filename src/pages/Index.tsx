import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { differenceInMinutes, startOfDay, endOfDay } from "date-fns";
import { Footer } from "@/components/Footer";
import { FastingSection } from "@/components/sections/FastingSection";
import { WeightSection } from "@/components/sections/WeightSection";
import { WorkoutSection } from "@/components/sections/WorkoutSection";
import { ReadingSection } from "@/components/sections/ReadingSection";

export const Index = () => {
  const [weightData, setWeightData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [fastingSessions, setFastingSessions] = useState([]);
  const [readingSessions, setReadingSessions] = useState([]);
  const [isCurrentlyFasting, setIsCurrentlyFasting] = useState(false);
  const [todayReadingCompleted, setTodayReadingCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data fetch
    fetchWeights();
    fetchWorkouts();
    fetchFastingSessions();
    fetchReadingSessions();

    // Set up real-time subscriptions
    const weightsChannel = supabase
      .channel('weights-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'weights' }, 
        () => {
          console.log('Weights updated, fetching new data...');
          fetchWeights();
        }
      )
      .subscribe();

    const workoutsChannel = supabase
      .channel('workouts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'workouts' }, 
        () => {
          console.log('Workouts updated, fetching new data...');
          fetchWorkouts();
        }
      )
      .subscribe();

    const fastingChannel = supabase
      .channel('fasting-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'fasting_sessions' }, 
        () => {
          console.log('Fasting sessions updated, fetching new data...');
          fetchFastingSessions();
        }
      )
      .subscribe();

    const readingChannel = supabase
      .channel('reading-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sessions' }, 
        () => {
          console.log('Reading sessions updated, fetching new data...');
          fetchReadingSessions();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(weightsChannel);
      supabase.removeChannel(workoutsChannel);
      supabase.removeChannel(fastingChannel);
      supabase.removeChannel(readingChannel);
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

    console.log('Fetched workouts:', data);
    setWorkouts(data);
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
    const lastSession = data[data.length - 1];
    setIsCurrentlyFasting(lastSession && !lastSession.end_time);
  };

  const fetchReadingSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching reading sessions:', error);
      toast({
        title: "Error fetching reading sessions",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setReadingSessions(data || []);
    
    // Check if there's a completed session today
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    
    const todaySession = data?.find(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= todayStart && sessionDate <= todayEnd && session.completed;
    });
    
    setTodayReadingCompleted(!!todaySession);
  };

  const handleWeightSubmit = async (weight: number, fatPercentage?: number, musclePercentage?: number) => {
    const { error } = await supabase
      .from('weights')
      .insert([{ 
        weight,
        fat_percentage: fatPercentage,
        muscle_percentage: musclePercentage
      }]);

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
  };

  const handleReadingSubmit = async () => {
    const { error } = await supabase
      .from('sessions')
      .insert([{
        completed: true
      }]);

    if (error) {
      console.error('Error recording reading session:', error);
      toast({
        title: "Error saving reading session",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <>
      <main className="min-h-screen container max-w-3xl p-4 space-y-4 sm:space-y-6">
        <FastingSection
          fastingSessions={fastingSessions}
          onStartFasting={handleStartFasting}
          onEndFasting={handleEndFasting}
          isCurrentlyFasting={isCurrentlyFasting}
        />
        <WeightSection
          weightData={weightData}
          onWeightSubmit={handleWeightSubmit}
        />
        <WorkoutSection
          workouts={workouts}
          onWorkoutSubmit={handleWorkoutSubmit}
        />
        <ReadingSection
          readingSessions={readingSessions}
          onReadingSubmit={handleReadingSubmit}
          todayCompleted={todayReadingCompleted}
        />
      </main>
      <Footer />
    </>
  );
};

export default Index;
