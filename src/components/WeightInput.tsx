import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WeightInputProps {
  onWeightSubmit: (weight: number) => void;
}

export const WeightInput = ({ onWeightSubmit }: WeightInputProps) => {
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }
    onWeightSubmit(weightNum);
    setWeight("");
    toast({
      title: "Weight updated",
      description: "Your weight has been recorded successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight (kg)"
        step="0.1"
        min="0"
        className="w-32"
      />
      <Button type="submit">Add Weight</Button>
    </form>
  );
};