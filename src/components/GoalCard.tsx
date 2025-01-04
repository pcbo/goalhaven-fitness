import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
}

export const GoalCard = ({ title, current, target, unit }: GoalCardProps) => {
  const progress = Math.min((current / target) * 100, 100);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-sm text-muted-foreground">
          {current}/{target} {unit}
        </span>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};