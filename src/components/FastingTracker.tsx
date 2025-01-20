import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Minus, Timer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { FastingCountdown } from "./FastingCountdown";

interface FastingSession {
  id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  date: string;
}

interface FastingTrackerProps {
  initialSessions: FastingSession[];
  onStartFasting: () => void;
  onEndFasting: () => void;
  isCurrentlyFasting: boolean;
}

export const FastingTracker = ({
  initialSessions,
  onStartFasting,
  onEndFasting,
  isCurrentlyFasting,
}: FastingTrackerProps) => {
  const currentSession = initialSessions[initialSessions.length - 1];
  const previousSession = initialSessions[initialSessions.length - 2];

  const getComparisonIcon = (current: number, previous: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM HH:mm");
  };

  return (
    <div className="w-full bg-background rounded-lg">
      <CardHeader className="px-0">
        <CardTitle>Fasting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="flex flex-col items-center justify-between gap-6">
          <div className="w-full">
            {isCurrentlyFasting && currentSession ? (
              <div className="space-y-2">
                <FastingCountdown startTime={currentSession.start_time} />
                <div className="text-sm text-muted-foreground text-center mt-4">
                  Started: {formatDateTime(currentSession.start_time)}
                </div>
              </div>
            ) : currentSession?.duration_minutes ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary text-center">
                  {formatDuration(currentSession.duration_minutes)}
                </div>
                {previousSession?.duration_minutes && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground justify-center">
                    {getComparisonIcon(
                      currentSession.duration_minutes,
                      previousSession.duration_minutes
                    )}
                    vs previous: {formatDuration(previousSession.duration_minutes)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-3xl font-bold text-primary text-center">No sessions yet</div>
            )}
          </div>
          <Button
            onClick={isCurrentlyFasting ? onEndFasting : onStartFasting}
            variant={isCurrentlyFasting ? "destructive" : "default"}
            className="w-full sm:w-auto h-12 px-6"
          >
            <Timer className="mr-2 h-5 w-5" />
            {isCurrentlyFasting ? "End Fast" : "Start Fast"}
          </Button>
        </div>

        {initialSessions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Start</TableHead>
                  <TableHead className="whitespace-nowrap">End</TableHead>
                  <TableHead className="whitespace-nowrap">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialSessions.slice(-5).reverse().map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(session.start_time)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {session.end_time ? formatDateTime(session.end_time) : "Ongoing"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {session.duration_minutes
                        ? formatDuration(session.duration_minutes)
                        : "In progress"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  );
};