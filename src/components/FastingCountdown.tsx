import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FastingCountdownProps {
  startTime: string;
  targetHours?: number;
}

export const FastingCountdown = ({ startTime, targetHours = 16 }: FastingCountdownProps) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const start = new Date(startTime);
      const elapsedMinutes = (now.getTime() - start.getTime()) / (1000 * 60);
      const targetMinutes = targetHours * 60;
      const currentProgress = Math.min((elapsedMinutes / targetMinutes) * 100, 100);
      
      // Calculate remaining time
      const remainingMinutes = Math.max(targetMinutes - elapsedMinutes, 0);
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.floor(remainingMinutes % 60);
      setRemainingTime(`${hours}h ${minutes}m`);
      
      setProgress(currentProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [startTime, targetHours]);

  // Create 16 stripes (one for each hour)
  const stripes = Array.from({ length: 16 }, (_, i) => {
    const rotation = (i * 360) / 16;
    const isCompleted = (progress / 100) * 16 > i;
    
    return (
      <rect
        key={i}
        x="47.5%"
        y="0"
        width="5%"
        height="50%"
        rx="2"
        transform={`rotate(${rotation} 50 50)`}
        className={cn(
          "origin-bottom transition-colors duration-500",
          isCompleted ? "fill-primary" : "fill-secondary/30"
        )}
      />
    );
  });

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90 transform"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          className="opacity-30"
        />
        {stripes}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-bold text-primary">{remainingTime}</div>
        <div className="text-sm text-muted-foreground">remaining</div>
      </div>
    </div>
  );
};