import { ReadingTracker } from "@/components/ReadingTracker";
import { CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ReadingSectionProps {
  readingSessions: any[];
  onReadingSubmit: () => void;
  todayCompleted: boolean;
}

export const ReadingSection = ({ readingSessions, onReadingSubmit, todayCompleted }: ReadingSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CollapsibleTrigger className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Reading</CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <ReadingTracker
              onReadingSubmit={onReadingSubmit}
              todayCompleted={todayCompleted}
              readingSessions={readingSessions}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
};