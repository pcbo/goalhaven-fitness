import { GoalsForm } from "@/components/settings/GoalsForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Settings = () => {
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fitness Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalsForm />
        </CardContent>
      </Card>
    </div>
  );
};