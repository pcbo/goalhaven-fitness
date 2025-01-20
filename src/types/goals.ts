export interface FitnessGoals {
  fastingHours: number;
  targetWeight: number;
  targetFatPercentage: number;
  targetMusclePercentage: number;
  targetPushups: number;
  targetSitups: number;
  targetPlankMinutes: number;
}

export interface GoalInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}