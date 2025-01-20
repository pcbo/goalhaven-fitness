import { GoalsForm } from "@/components/settings/GoalsForm";

export const Settings = () => {
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <GoalsForm />
    </div>
  );
};