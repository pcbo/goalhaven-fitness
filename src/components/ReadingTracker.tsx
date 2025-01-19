import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ReadingTrackerProps {
  onReadingSubmit: (pagesRead: number) => void;
  todayCompleted: boolean;
}

export const ReadingTracker = ({ onReadingSubmit, todayCompleted }: ReadingTrackerProps) => {
  const [pagesRead, setPagesRead] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagesRead < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of pages",
        variant: "destructive",
      });
      return;
    }
    onReadingSubmit(pagesRead);
    setPagesRead(0);
    toast({
      title: "Reading recorded",
      description: "Your reading has been recorded successfully",
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pages" className="text-sm font-medium">
            Pages read today
          </label>
          <Input
            id="pages"
            type="number"
            value={pagesRead || ''}
            onChange={(e) => setPagesRead(parseInt(e.target.value) || 0)}
            min="0"
            className="mt-1"
            placeholder="Enter number of pages"
          />
        </div>
        <Button type="submit" className="w-full">Record Reading</Button>
      </form>
      {todayCompleted && (
        <div className="text-center text-primary font-medium">
          Today's reading goal completed! 🎉
        </div>
      )}
    </div>
  );
};