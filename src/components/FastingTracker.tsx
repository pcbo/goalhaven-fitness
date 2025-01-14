import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDistanceToNow, format, differenceInMinutes } from "date-fns";

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
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {isCurrentlyFasting && currentSession ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatDistanceToNow(new Date(currentSession.start_time), { addSuffix: true })}
                </div>
                <div className="text-sm text-muted-foreground">
                  Started: {formatDateTime(currentSession.start_time)}
                </div>
              </div>
            ) : currentSession?.duration_minutes ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatDuration(currentSession.duration_minutes)}
                </div>
                {previousSession?.duration_minutes && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    {getComparisonIcon(
                      currentSession.duration_minutes,
                      previousSession.duration_minutes
                    )}
                    vs previous: {formatDuration(previousSession.duration_minutes)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-3xl font-bold text-primary">No sessions yet</div>
            )}
          </div>
          <Button
            onClick={isCurrentlyFasting ? onEndFasting : onStartFasting}
            variant={isCurrentlyFasting ? "destructive" : "default"}
            className="h-12 px-6"
          >
            <Timer className="mr-2 h-5 w-5" />
            {isCurrentlyFasting ? "End Fast" : "Start Fast"}
          </Button>
        </div>

        {initialSessions.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialSessions.slice(-5).reverse().map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{formatDateTime(session.start_time)}</TableCell>
                    <TableCell>
                      {session.end_time ? formatDateTime(session.end_time) : "Ongoing"}
                    </TableCell>
                    <TableCell>
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
    </Card>
  );
};