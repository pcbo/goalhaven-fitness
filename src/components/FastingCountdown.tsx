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

  // Calculate the circle's circumference and the filled portion
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const filled = ((100 - progress) * circumference) / 100;

  return (
    <div className="relative w-full max-w-[10rem] aspect-square mx-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90 transform"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={filled}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-primary">{remainingTime}</div>
        <div className="text-xs text-muted-foreground">remaining</div>
      </div>
    </div>
  );
};