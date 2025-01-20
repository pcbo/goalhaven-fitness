import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { format } from "date-fns";

interface WeightData {
  date: string;
  weight: number;
  fat_percentage: number | null;
  muscle_percentage: number | null;
}

interface WeightTrackerProps {
  initialWeightData: WeightData[];
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightTracker = ({ initialWeightData, onWeightSubmit }: WeightTrackerProps) => {
  const getCurrentWeight = () => initialWeightData[initialWeightData.length - 1];
  const getPreviousWeight = () => initialWeightData[initialWeightData.length - 2];

  const getComparisonIcon = (current: number, previous: number, isMuscle: boolean = false) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current > previous) {
      return <ArrowUp className={`h-4 w-4 ${isMuscle ? 'text-green-500' : 'text-red-500'}`} />;
    }
    if (current < previous) {
      return <ArrowDown className={`h-4 w-4 ${isMuscle ? 'text-red-500' : 'text-green-500'}`} />;
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="bg-background rounded-lg">
      <CardContent className="px-0">
        <WeightInput onWeightSubmit={onWeightSubmit} />
        {initialWeightData.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weight</span>
                  {getComparisonIcon(
                    getCurrentWeight()?.weight || 0,
                    getPreviousWeight()?.weight
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">{getCurrentWeight()?.weight || 0} kg</p>
                {getPreviousWeight() && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousWeight()?.weight} kg
                  </p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fat</span>
                  {getComparisonIcon(
                    getCurrentWeight()?.fat_percentage || 0,
                    getPreviousWeight()?.fat_percentage
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {getCurrentWeight()?.fat_percentage || 0}%
                </p>
                {getPreviousWeight()?.fat_percentage && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousWeight()?.fat_percentage}%
                  </p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Muscle</span>
                  {getComparisonIcon(
                    getCurrentWeight()?.muscle_percentage || 0,
                    getPreviousWeight()?.muscle_percentage,
                    true
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {getCurrentWeight()?.muscle_percentage || 0}%
                </p>
                {getPreviousWeight()?.muscle_percentage && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Previous: {getPreviousWeight()?.muscle_percentage}%
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
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
                  {initialWeightData.slice(-5).reverse().map((weight, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(weight.date), "dd/MM HH:mm")}</TableCell>
                      <TableCell>{weight.weight}</TableCell>
                      <TableCell>{weight.fat_percentage || "-"}</TableCell>
                      <TableCell>{weight.muscle_percentage || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
};