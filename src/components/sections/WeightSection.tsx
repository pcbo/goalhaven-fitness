import { WeightTracker } from "@/components/WeightTracker";

interface WeightSectionProps {
  weightData: any[];
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightSection = ({ weightData, onWeightSubmit }: WeightSectionProps) => {
  return (
    <section id="weight" className="py-8">
      <WeightTracker
        initialWeightData={weightData}
        onWeightSubmit={onWeightSubmit}
      />
    </section>
  );
};