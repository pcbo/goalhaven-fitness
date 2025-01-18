import { WorkoutTracker } from "@/components/WorkoutTracker";

interface WorkoutSectionProps {
  workouts: any[];
  onWorkoutSubmit: (workout: { pushups: number; situps: number; plankSeconds: number }) => void;
}

export const WorkoutSection = ({ workouts, onWorkoutSubmit }: WorkoutSectionProps) => {
  return (
    <section id="workout" className="py-8">
      <WorkoutTracker
        initialWorkouts={workouts}
        onWorkoutSubmit={onWorkoutSubmit}
      />
    </section>
  );
};