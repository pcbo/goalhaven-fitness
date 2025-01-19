import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ReadingTrackerProps {
  onReadingSubmit: (pagesRead: number) => void;
  todayCompleted: boolean;
  readingSessions: any[];
}

export const ReadingTracker = ({ onReadingSubmit, todayCompleted, readingSessions }: ReadingTrackerProps) => {
  const { toast } = useToast();

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
            Today's reading completed! 🎉
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
                      <span className="text-green-500">✓ Completed</span>
                    ) : (
                      <span className="text-red-500">✗ Missed</span>
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