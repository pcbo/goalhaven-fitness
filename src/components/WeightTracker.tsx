import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightInput } from "@/components/WeightInput";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WeightEntry {
  date: string;
  weight: number;
  fat_percentage?: number | null;
  muscle_percentage?: number | null;
}

interface WeightTrackerProps {
  initialWeightData: WeightEntry[];
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightTracker = ({ initialWeightData, onWeightSubmit }: WeightTrackerProps) => {
  const getComparisonIcon = (current: number | null | undefined, previous: number | null | undefined) => {
    if (!current || !previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current > previous) return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const latestEntry = initialWeightData[initialWeightData.length - 1];
  const previousEntry = initialWeightData[initialWeightData.length - 2];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div>
              <div className="text-3xl font-bold text-primary">
                {latestEntry?.weight.toFixed(2) || "0.00"} kg
              </div>
              {previousEntry && (
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  {getComparisonIcon(latestEntry?.weight, previousEntry?.weight)}
                  vs previous: {previousEntry?.weight.toFixed(2)} kg
                </div>
              )}
            </div>
            {latestEntry?.fat_percentage !== null && latestEntry?.fat_percentage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Fat: {latestEntry.fat_percentage.toFixed(1)}%
                {previousEntry && previousEntry.fat_percentage !== null && previousEntry.fat_percentage !== undefined && (
                  <span className="ml-1 flex items-center gap-1">
                    {getComparisonIcon(latestEntry.fat_percentage, previousEntry.fat_percentage)}
                    vs previous: {previousEntry.fat_percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            )}
            {latestEntry?.muscle_percentage !== null && latestEntry?.muscle_percentage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Muscle: {latestEntry.muscle_percentage.toFixed(1)}%
                {previousEntry && previousEntry.muscle_percentage !== null && previousEntry.muscle_percentage !== undefined && (
                  <span className="ml-1 flex items-center gap-1">
                    {getComparisonIcon(latestEntry.muscle_percentage, previousEntry.muscle_percentage)}
                    vs previous: {previousEntry.muscle_percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            )}
          </div>
          <WeightInput onWeightSubmit={onWeightSubmit} />
        </div>
        
        {initialWeightData.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Fat %</TableHead>
                  <TableHead>Muscle %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialWeightData.slice(-5).reverse().map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.weight.toFixed(2)}</TableCell>
                    <TableCell>{entry.fat_percentage?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{entry.muscle_percentage?.toFixed(1) || '-'}</TableCell>
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