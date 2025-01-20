import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepTracker } from "@/components/SleepTracker";
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
    <section id="sleep" className="py-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CardHeader className="px-0">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle>Sleep</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CardContent className="px-0">
            <CollapsibleContent>
              <SleepTracker
                initialSessions={sleepSessions}
                onSleepSubmit={onSleepSubmit}
              />
            </CollapsibleContent>
          </CardContent>
        </div>
      </Collapsible>
    </section>
  );
};