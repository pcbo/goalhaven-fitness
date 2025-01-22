import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SleepTrackerProps {
  initialSessions: any[];
  onSleepSubmit: (quality: number, hours: number) => void;
}

export const SleepTracker = ({ initialSessions, onSleepSubmit }: SleepTrackerProps) => {
  const [quality, setQuality] = useState<string>("3");
  const [hours, setHours] = useState<string>("8");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSleepSubmit(Number(quality), Number(hours));
    setQuality("3");
    setHours("8");
  };

  const getQualityText = (quality: number) => {
    switch (quality) {
      case 1: return "Horrible";
      case 2: return "Poor";
      case 3: return "Neutral";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "Unknown";
    }
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours}h`;
    return `${wholeHours}h${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quality">Sleep Quality</Label>
            <Select
              value={quality}
              onValueChange={setQuality}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Horrible</SelectItem>
                <SelectItem value="2">2 - Poor</SelectItem>
                <SelectItem value="3">3 - Neutral</SelectItem>
                <SelectItem value="4">4 - Good</SelectItem>
                <SelectItem value="5">5 - Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Slept</Label>
            <Input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="w-full sm:w-auto h-12 px-6">Record Sleep</Button>
        </div>
      </form>

      {initialSessions.length > 0 && (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSessions.slice(0, 5).map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(session.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{getQualityText(session.quality)}</TableCell>
                  <TableCell>{formatHours(session.hours)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};