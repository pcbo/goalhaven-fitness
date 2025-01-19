import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReadingTrackerProps {
  onReadingSubmit: (pagesRead: number) => void;
  todayCompleted: boolean;
}

export const ReadingTracker = ({ onReadingSubmit, todayCompleted }: ReadingTrackerProps) => {
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
    </div>
  );
};