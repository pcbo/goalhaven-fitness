import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, subDays, startOfDay, isAfter, isBefore, isEqual } from "date-fns";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReadingTrackerProps {
  onReadingSubmit: (pagesRead: number) => void;
  todayCompleted: boolean;
  readingSessions: any[];
}

export const ReadingTracker = ({ onReadingSubmit, todayCompleted, readingSessions }: ReadingTrackerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const checkMissedDays = async () => {
      const today = startOfDay(new Date());
      const lastFiveDays = Array.from({ length: 5 }, (_, i) => startOfDay(subDays(today, i)));
      
      // Check each of the last 5 days
      for (const date of lastFiveDays) {
        const sessionExists = readingSessions.some(session => {
          const sessionDate = startOfDay(new Date(session.date));
          return isEqual(sessionDate, date);
        });

        // If no session exists for this day and it's not today, create a "missed" session
        if (!sessionExists && isBefore(date, today)) {
          console.log("Adding missed session for:", format(date, "yyyy-MM-dd"));
          const { error } = await supabase
            .from('reading_sessions')
            .insert([{
              date: date.toISOString(),
              pages_read: 0,
              completed: false
            }]);

          if (error) {
            console.error('Error recording missed session:', error);
            toast({
              title: "Error recording missed session",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      }
    };

    checkMissedDays();
  }, [readingSessions, toast]);

  const handleSubmit = () => {
    const goals = JSON.parse(localStorage.getItem('fitness-goals') || '{}');
    const targetPages = goals.targetPagesPerDay || 5;
    onReadingSubmit(targetPages);
    toast({
      title: "Reading recorded",
      description: "Your reading has been recorded successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {!todayCompleted ? (
          <Button 
            onClick={handleSubmit}
            className="w-full"
          >
            I read today
          </Button>
        ) : (
          <div className="text-center text-primary font-medium">
            Today's reading completed
          </div>
        )}
      </div>

      {readingSessions.length > 0 && (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readingSessions.slice(-5).reverse().map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(session.date), "dd/MM")}</TableCell>
                  <TableCell>
                    {session.completed ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Completed
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <X className="h-4 w-4" /> Missed
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};