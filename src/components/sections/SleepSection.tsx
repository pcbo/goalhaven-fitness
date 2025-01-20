import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepTracker } from "@/components/SleepTracker";

interface SleepSectionProps {
  sleepSessions: any[];
  onSleepSubmit: (quality: number, hours: number) => void;
}

export const SleepSection = ({ sleepSessions, onSleepSubmit }: SleepSectionProps) => {
  return (
    <section id="sleep" className="py-8">
      <div className="w-full bg-background rounded-lg">
        <CardHeader className="px-0">
          <CardTitle>Sleep</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <SleepTracker
            initialSessions={sleepSessions}
            onSleepSubmit={onSleepSubmit}
          />
        </CardContent>
      </div>
    </section>
  );
};