import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingTracker } from "@/components/ReadingTracker";

interface ReadingSectionProps {
  readingSessions: any[];
  onReadingSubmit: () => void;
  todayCompleted: boolean;
}

export const ReadingSection = ({ readingSessions, onReadingSubmit, todayCompleted }: ReadingSectionProps) => {
  return (
    <section id="reading" className="py-8">
      <div className="w-full bg-background rounded-lg">
        <CardHeader className="px-0">
          <CardTitle>Reading</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ReadingTracker
            onReadingSubmit={onReadingSubmit}
            todayCompleted={todayCompleted}
            readingSessions={readingSessions}
          />
        </CardContent>
      </div>
    </section>
  );
};