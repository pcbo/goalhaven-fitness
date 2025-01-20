import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingTracker } from "@/components/ReadingTracker";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ReadingSectionProps {
  readingSessions: any[];
  onReadingSubmit: () => void;
  todayCompleted: boolean;
}

export const ReadingSection = ({ readingSessions, onReadingSubmit, todayCompleted }: ReadingSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section id="reading" className="py-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full bg-background rounded-lg">
          <CardHeader className="px-0">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle>Reading</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CardContent className="px-0">
            <CollapsibleContent>
              <ReadingTracker
                onReadingSubmit={onReadingSubmit}
                todayCompleted={todayCompleted}
                readingSessions={readingSessions}
              />
            </CollapsibleContent>
          </CardContent>
        </div>
      </Collapsible>
    </section>
  );
};