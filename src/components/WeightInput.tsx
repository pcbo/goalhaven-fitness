import { useState, useEffect, useRef } from "react";
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
  const popupRef = useRef<Window | null>(null);
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
      console.log('🚀 Starting Withings import process...');
      
      const { data, error } = await supabase.functions.invoke('withings-auth');
      
      if (error) {
        console.error('❌ Error invoking withings-auth:', error);
        throw error;
      }

      console.log('🔗 Received auth URL:', data.url);

      const width = 800;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Set up message handler before opening the popup
      const handleMessage = async (event: MessageEvent) => {
        console.log('📨 Received message:', event);
        
        try {
          let token;
          if (typeof event.data === 'string') {
            console.log('🔄 Parsing string message:', event.data);
            try {
              const parsedData = JSON.parse(event.data);
              token = parsedData.token;
            } catch (e) {
              const match = event.data.match(/token: "([^"]+)"/);
              if (match) {
                token = match[1];
                console.log('✅ Extracted token from string:', token);
              } else {
                console.error('❌ Failed to extract token from message');
                return;
              }
            }
          } else if (event.data && event.data.token) {
            token = event.data.token;
            console.log('🔑 Extracted token from object:', token);
          }

          if (!token) {
            console.log('⚠️ No token found in message');
            return;
          }

          console.log('📡 Invoking withings-measurements with token:', token);
          const { data: measurementData, error: measurementError } = await supabase.functions.invoke(
            'withings-measurements',
            { body: { token } }
          );

          if (measurementError) {
            console.error('❌ Error fetching measurements:', measurementError);
            throw measurementError;
          }

          console.log('📊 Received measurement data:', measurementData);

          if (measurementData && measurementData.measurement) {
            const { weight, fat_percentage, muscle_percentage } = measurementData.measurement;
            
            if (weight) setWeight(weight.toString());
            if (fat_percentage) setFatPercentage(fat_percentage.toString());
            if (muscle_percentage) setMusclePercentage(muscle_percentage.toString());
            
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
          console.error('❌ Error processing Withings data:', error);
          toast({
            title: "Error importing measurements",
            description: "Failed to import measurements from Withings",
            variant: "destructive",
          });
        } finally {
          window.removeEventListener('message', handleMessage);
          setIsImporting(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Open popup after setting up message handler
      popupRef.current = window.open(
        data.url,
        'Withings Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popupRef.current) {
        window.removeEventListener('message', handleMessage);
        throw new Error('Popup blocked. Please enable popups for this site.');
      }

      // Set up interval to check if window is closed without receiving a message
      const checkWindow = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(checkWindow);
          window.removeEventListener('message', handleMessage);
          setIsImporting(false);
        }
      }, 500);

    } catch (error) {
      console.error('❌ Error starting Withings import:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start Withings import",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

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
