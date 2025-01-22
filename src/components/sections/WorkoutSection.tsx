import { WorkoutTracker } from "@/components/WorkoutTracker";
import { CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WorkoutSectionProps {
  workouts: any[];
  onWorkoutSubmit: (workout: { pushups: number; situps: number; plankSeconds: number }) => void;
}

export const WorkoutSection = ({ workouts, onWorkoutSubmit }: WorkoutSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="workout" className="py-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CollapsibleTrigger className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Workouts</CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <WorkoutTracker
              initialWorkouts={workouts}
              onWorkoutSubmit={onWorkoutSubmit}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
};