import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WeightInputProps {
  onWeightSubmit: (weight: number, fatPercentage?: number, musclePercentage?: number) => void;
}

export const WeightInput = ({ onWeightSubmit }: WeightInputProps) => {
  const [weight, setWeight] = useState("");
  const [fatPercentage, setFatPercentage] = useState("");
  const [musclePercentage, setMusclePercentage] = useState("");
  const [isImporting, setIsImporting] = useState(false);
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

  const handleWithingsImport = async () => {
    try {
      setIsImporting(true);
      const { data, error } = await supabase.functions.invoke('withings-auth');
      
      if (error) throw error;
      
      // Open the authorization URL in a popup window
      const popup = window.open(
        data.url,
        'Withings Authorization',
        'width=800,height=600'
      );

      // Listen for the callback message
      window.addEventListener('message', async (event) => {
        if (event.data.token) {
          try {
            // Get the latest measurements using the access token
            const { data: measurementData, error: measurementError } = await supabase.functions.invoke(
              'withings-measurements',
              { body: { token: event.data.token } }
            );

            if (measurementError) throw measurementError;

            if (measurementData.measurement) {
              const { weight, fat_percentage } = measurementData.measurement;
              // Instead of submitting directly, fill in the form fields
              setWeight(weight.toString());
              if (fat_percentage) {
                setFatPercentage(fat_percentage.toString());
              }
              toast({
                title: "Measurements imported",
                description: "Your Withings measurements have been filled in. Please review and submit.",
              });
            } else {
              toast({
                title: "No measurements found",
                description: "No recent measurements were found in your Withings account",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error fetching measurements:', error);
            toast({
              title: "Error importing measurements",
              description: "Failed to import measurements from Withings",
              variant: "destructive",
            });
          }
        } else if (event.data.error) {
          toast({
            title: "Authorization failed",
            description: event.data.error,
            variant: "destructive",
          });
        }
        popup?.close();
      });
    } catch (error) {
      console.error('Error starting Withings import:', error);
      toast({
        title: "Error",
        description: "Failed to start Withings import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="weight" className="text-sm font-medium">
            Weight (kg)
          </label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="fat" className="text-sm font-medium">
            Fat %
          </label>
          <Input
            id="fat"
            type="number"
            value={fatPercentage}
            onChange={(e) => setFatPercentage(e.target.value)}
            step="0.1"
            min="0"
            max="100"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="muscle" className="text-sm font-medium">
            Muscle %
          </label>
          <Input
            id="muscle"
            type="number"
            value={musclePercentage}
            onChange={(e) => setMusclePercentage(e.target.value)}
            step="0.1"
            min="0"
            max="100"
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button type="submit" className="w-full sm:w-auto h-12 px-6">Record Measurements</Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full sm:w-auto h-12 px-6"
          onClick={handleWithingsImport}
          disabled={isImporting}
        >
          {isImporting ? "Importing..." : "Import from Withings"}
        </Button>
      </div>
    </form>
  );
};