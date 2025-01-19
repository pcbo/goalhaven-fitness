import { ReadingTracker } from "@/components/ReadingTracker";

interface ReadingSectionProps {
  readingSessions: any[];
  onReadingSubmit: (pagesRead: number) => void;
  todayCompleted: boolean;
}

export const ReadingSection = ({ readingSessions, onReadingSubmit, todayCompleted }: ReadingSectionProps) => {
  return (
    <section id="reading" className="py-8">
      <ReadingTracker
        onReadingSubmit={onReadingSubmit}
        todayCompleted={todayCompleted}
      />
    </section>
  );
};