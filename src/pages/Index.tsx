import { FastingSection } from "@/components/sections/FastingSection";
import { WeightSection } from "@/components/sections/WeightSection";
import { WorkoutSection } from "@/components/sections/WorkoutSection";
import { ReadingSection } from "@/components/sections/ReadingSection";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

export default function Index() {
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6 pb-20">
      <SettingsDialog />
      <FastingSection />
      <WeightSection />
      <WorkoutSection />
      <ReadingSection />
    </div>
  );
}