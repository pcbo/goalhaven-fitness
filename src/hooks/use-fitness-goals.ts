import { useState, useEffect } from "react";
import type { FitnessGoals } from "@/types/goals";

const DEFAULT_GOALS: FitnessGoals = {
  fastingHours: 16,
  targetWeight: 0,
  targetFatPercentage: 0,
  targetMusclePercentage: 0,
  targetPushups: 0,
  targetSitups: 0,
  targetPlankMinutes: 0,
};

export const useFitnessGoals = () => {
  const [goals, setGoals] = useState<FitnessGoals>(() => {
    const savedGoals = localStorage.getItem('fitness-goals');
    return savedGoals ? JSON.parse(savedGoals) : DEFAULT_GOALS;
  });

  useEffect(() => {
    localStorage.setItem('fitness-goals', JSON.stringify(goals));
  }, [goals]);

  const updateGoal = (key: keyof FitnessGoals, value: number) => {
    setGoals(prev => ({ ...prev, [key]: value }));
  };

  return { goals, updateGoal };
};