import { WeightTracker } from "@/components/WeightTracker";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WeightSectionProps {
  weightData: any[];
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightSection = ({ weightData, onWeightSubmit }: WeightSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section id="weight" className="py-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CardHeader className="px-0">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle>Weight</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <WeightTracker
              initialWeightData={weightData}
              onWeightSubmit={onWeightSubmit}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
};