import { SleepTracker } from "@/components/SleepTracker";
import { CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SleepSectionProps {
  sleepSessions: any[];
  onSleepSubmit: (quality: number, hours: number) => void;
}

export const SleepSection = ({ sleepSessions, onSleepSubmit }: SleepSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section id="sleep" className="py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CollapsibleTrigger className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Sleep</CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <SleepTracker
              initialSessions={sleepSessions}
              onSleepSubmit={onSleepSubmit}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
};