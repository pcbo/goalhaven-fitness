import { useState, useEffect } from "react";
import { FastingSection } from "@/components/sections/FastingSection";
import { WeightSection } from "@/components/sections/WeightSection";
import { WorkoutSection } from "@/components/sections/WorkoutSection";
import { ReadingSection } from "@/components/sections/ReadingSection";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { toast } = useToast();
  const [fastingSessions, setFastingSessions] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [readingSessions, setReadingSessions] = useState<any[]>([]);
  const [isCurrentlyFasting, setIsCurrentlyFasting] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchFastingSessions();
    fetchWeightData();
    fetchWorkouts();
    fetchReadingSessions();
  }, []);

  // Fasting functions
  const fetchFastingSessions = async () => {
    const { data, error } = await supabase
      .from('fasting_sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching fasting sessions:', error);
      return;
    }

    setFastingSessions(data || []);
    // Check if there's an ongoing fast
    const lastSession = data?.[0];
    setIsCurrentlyFasting(lastSession && !lastSession.end_time);
  };

  const handleStartFasting = async () => {
    const { error } = await supabase
      .from('fasting_sessions')
      .insert([{ start_time: new Date().toISOString() }]);

    if (error) {
      toast({
        title: "Error starting fast",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchFastingSessions();
    toast({
      title: "Fast started",
      description: "Your fasting session has begun",
    });
  };

  const handleEndFasting = async () => {
    const currentSession = fastingSessions[0];
    if (!currentSession) return;

    const endTime = new Date();
    const startTime = new Date(currentSession.start_time);
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const { error } = await supabase
      .from('fasting_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes
      })
      .eq('id', currentSession.id);

    if (error) {
      toast({
        title: "Error ending fast",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchFastingSessions();
    toast({
      title: "Fast ended",
      description: "Your fasting session has been recorded",
    });
  };

  // Weight functions
  const fetchWeightData = async () => {
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching weight data:', error);
      return;
    }

    setWeightData(data || []);
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
      toast({
        title: "Error recording weight",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchWeightData();
  };

  // Workout functions
  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return;
    }

    setWorkouts(data || []);
  };

  const handleWorkoutSubmit = async (workout: { pushups: number; situps: number; plankSeconds: number }) => {
    const { error } = await supabase
      .from('workouts')
      .insert([{
        pushups: workout.pushups,
        situps: workout.situps,
        plank_seconds: workout.plankSeconds
      }]);

    if (error) {
      toast({
        title: "Error recording workout",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchWorkouts();
  };

  // Reading functions
  const fetchReadingSessions = async () => {
    const { data, error } = await supabase
      .from('reading_sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching reading sessions:', error);
      return;
    }

    setReadingSessions(data || []);
  };

  const handleReadingSubmit = async () => {
    const { error } = await supabase
      .from('reading_sessions')
      .insert([{ completed: true }]);

    if (error) {
      toast({
        title: "Error recording reading",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchReadingSessions();
  };

  // Check if today's reading is completed
  const todayCompleted = readingSessions.some(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString() && session.completed;
  });

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6 pb-20">
      <SettingsDialog />
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
        todayCompleted={todayCompleted}
      />
    </div>
  );
}