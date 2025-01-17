import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WeightInputProps {
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightInput = ({ onWeightSubmit }: WeightInputProps) => {
  const [weight, setWeight] = useState("");
  const [fatPercentage, setFatPercentage] = useState("");
  const [musclePercentage, setMusclePercentage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const fatNum = fatPercentage ? parseFloat(fatPercentage) : undefined;
    const muscleNum = musclePercentage ? parseFloat(musclePercentage) : undefined;

    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }

    if (fatPercentage && (isNaN(fatNum!) || fatNum! < 0 || fatNum! > 100)) {
      toast({
        title: "Invalid fat percentage",
        description: "Please enter a valid percentage between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    if (musclePercentage && (isNaN(muscleNum!) || muscleNum! < 0 || muscleNum! > 100)) {
      toast({
        title: "Invalid muscle percentage",
        description: "Please enter a valid percentage between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    onWeightSubmit(weightNum, fatNum, muscleNum);
    setWeight("");
    setFatPercentage("");
    setMusclePercentage("");
    toast({
      title: "Weight updated",
      description: "Your measurements have been recorded successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          step="0.1"
          min="0"
          className="w-32"
        />
        <Button type="submit">Add</Button>
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          value={fatPercentage}
          onChange={(e) => setFatPercentage(e.target.value)}
          placeholder="Fat %"
          step="0.1"
          min="0"
          max="100"
          className="w-32"
        />
        <Input
          type="number"
          value={musclePercentage}
          onChange={(e) => setMusclePercentage(e.target.value)}
          placeholder="Muscle %"
          step="0.1"
          min="0"
          max="100"
          className="w-32"
        />
      </div>
    </form>
  );
};