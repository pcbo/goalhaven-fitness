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
    if (!current) return <Minus className="h-4 w-4 text-gray-500" />;
    if (!previous) return current > 0 
      ? <ArrowUp className="h-4 w-4 text-green-500" />
      : <Minus className="h-4 w-4 text-gray-500" />;
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

  const getCurrentEntry = () => initialWeightData[initialWeightData.length - 1];
  const getPreviousEntry = () => initialWeightData[initialWeightData.length - 2];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight</CardTitle>
      </CardHeader>
      <CardContent>
        <WeightInput onWeightSubmit={onWeightSubmit} />
        {initialWeightData.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold">Latest Measurements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weight</span>
                  {getComparisonIcon(
                    getCurrentEntry()?.weight,
                    getPreviousEntry()?.weight
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">{getCurrentEntry()?.weight?.toFixed(1) || 0} kg</p>
                {getPreviousEntry() && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousEntry()?.weight?.toFixed(1)} kg
                  </p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fat %</span>
                  {getComparisonIcon(
                    getCurrentEntry()?.fat_percentage,
                    getPreviousEntry()?.fat_percentage
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {getCurrentEntry()?.fat_percentage?.toFixed(1) || '-'}%
                </p>
                {getPreviousEntry()?.fat_percentage && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousEntry()?.fat_percentage?.toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Muscle %</span>
                  {getComparisonIcon(
                    getCurrentEntry()?.muscle_percentage,
                    getPreviousEntry()?.muscle_percentage
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {getCurrentEntry()?.muscle_percentage?.toFixed(1) || '-'}%
                </p>
                {getPreviousEntry()?.muscle_percentage && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousEntry()?.muscle_percentage?.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-lg border">
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
                      <TableCell>{entry.weight.toFixed(1)}</TableCell>
                      <TableCell>{entry.fat_percentage?.toFixed(1) || '-'}</TableCell>
                      <TableCell>{entry.muscle_percentage?.toFixed(1) || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};