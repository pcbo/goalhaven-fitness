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
}

interface WeightTrackerProps {
  initialWeightData: WeightEntry[];
  onWeightSubmit: (weight: number) => void;
}

export const WeightTracker = ({ initialWeightData, onWeightSubmit }: WeightTrackerProps) => {
  const getComparisonIcon = (current: number, previous: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-500" />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">
              {initialWeightData[initialWeightData.length - 1]?.weight.toFixed(2) || "0.00"} kg
            </div>
            {initialWeightData.length > 1 && (
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                {getComparisonIcon(
                  initialWeightData[initialWeightData.length - 1]?.weight,
                  initialWeightData[initialWeightData.length - 2]?.weight
                )}
                vs previous: {initialWeightData[initialWeightData.length - 2]?.weight.toFixed(2)} kg
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialWeightData.slice(-5).reverse().map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.weight.toFixed(2)}</TableCell>
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