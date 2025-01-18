import { FastingTracker } from "@/components/FastingTracker";

interface FastingSectionProps {
  fastingSessions: any[];
  onStartFasting: () => void;
  onEndFasting: () => void;
  isCurrentlyFasting: boolean;
}

export const FastingSection = ({
  fastingSessions,
  onStartFasting,
  onEndFasting,
  isCurrentlyFasting,
}: FastingSectionProps) => {
  return (
    <section id="fasting" className="py-8">
      <FastingTracker
        initialSessions={fastingSessions}
        onStartFasting={onStartFasting}
        onEndFasting={onEndFasting}
        isCurrentlyFasting={isCurrentlyFasting}
      />
    </section>
  );
};