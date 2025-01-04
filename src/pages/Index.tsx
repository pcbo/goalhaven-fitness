import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart } from "@/components/WeightChart";
import { GoalCard } from "@/components/GoalCard";
import { WeightInput } from "@/components/WeightInput";

const Index = () => {
  const [weightData, setWeightData] = useState([
    { date: "2024-01-01", weight: 75 },
    { date: "2024-01-08", weight: 74.5 },
    { date: "2024-01-15", weight: 73.8 },
    { date: "2024-01-22", weight: 73.2 },
  ]);

  const handleWeightSubmit = (weight: number) => {
    const today = new Date().toISOString().split("T")[0];
    setWeightData([...weightData, { date: today, weight }]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">Fitness Tracker</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {weightData[weightData.length - 1]?.weight || 0} kg
              </div>
              <WeightInput onWeightSubmit={handleWeightSubmit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalCard
                title="Progress to Goal"
                current={weightData[weightData.length - 1]?.weight || 0}
                target={70}
                unit="kg"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightData} />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <GoalCard title="Weekly Workouts" current={3} target={5} unit="sessions" />
          <GoalCard title="Daily Steps" current={8000} target={10000} unit="steps" />
          <GoalCard title="Water Intake" current={1.5} target={2.5} unit="L" />
        </div>
      </div>
    </div>
  );
};

export default Index;