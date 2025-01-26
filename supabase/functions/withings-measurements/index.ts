import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    console.log('Received token in measurements function:', token);

    if (!token) {
      throw new Error('No access token provided');
    }

    const measureResponse = await fetch('https://wbsapi.withings.net/measure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        action: 'getmeas',
        meastypes: '1,6,8', // 1 for weight, 6 for muscle mass, 8 for fat ratio
        lastupdate: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000).toString(), // Last 24 hours
      }),
    });

    const data = await measureResponse.json();
    console.log('Withings API response:', data);
    
    if (data.status !== 0) {
      throw new Error(data.error || 'Failed to fetch measurements');
    }

    // Process the measurements to get the latest weight and fat percentage
    let latestMeasurement = null;
    if (data.body.measuregrps && data.body.measuregrps.length > 0) {
      const latest = data.body.measuregrps[0];
      const measures = latest.measures.reduce((acc: any, measure: any) => {
        if (measure.type === 1) { // Weight
          acc.weight = measure.value * Math.pow(10, measure.unit);
        } else if (measure.type === 8) { // Fat Ratio
          acc.fat_percentage = measure.value * Math.pow(10, measure.unit);
        } else if (measure.type === 6) { // Muscle Mass
          acc.muscle_percentage = (measure.value * Math.pow(10, measure.unit) / acc.weight) * 100;
        }
        return acc;
      }, {});

      console.log('Processed measurements:', measures);

      latestMeasurement = {
        weight: measures.weight,
        fat_percentage: measures.fat_percentage,
        muscle_percentage: measures.muscle_percentage,
        date: new Date(latest.date * 1000).toISOString(),
      };
    }

    return new Response(
      JSON.stringify({ measurement: latestMeasurement }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Withings measurements:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});