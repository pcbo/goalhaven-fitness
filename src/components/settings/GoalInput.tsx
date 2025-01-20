import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GoalInputProps } from "@/types/goals";

export const GoalInput = ({ label, value, onChange, min = 0, max, step = 1 }: GoalInputProps) => {
  return (
    <div>
      <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>{label}</Label>
      <Input
        id={label.toLowerCase().replace(/\s/g, '-')}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};