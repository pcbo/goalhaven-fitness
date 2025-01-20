import { WorkoutTracker } from "@/components/WorkoutTracker";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WorkoutSectionProps {
  workouts: any[];
  onWorkoutSubmit: (workout: { pushups: number; situps: number; plankSeconds: number }) => void;
}

export const WorkoutSection = ({ workouts, onWorkoutSubmit }: WorkoutSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section id="workout" className="py-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CardHeader className="px-0">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle>Workout</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
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