import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Starting measurements fetch...');
    const { token } = await req.json();
    console.log('🔑 Received token:', token);

    // First, get the user identifier using the token
    const userResponse = await fetch('https://wbsapi.withings.net/v2/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        action: 'getdevice'
      })
    });

    const userData = await userResponse.json();
    console.log('👤 User data response:', JSON.stringify(userData, null, 2));

    if (userData.status !== 0) {
      throw new Error(`Failed to get user data: ${JSON.stringify(userData)}`);
    }

    // Now get the measurements
    const measureResponse = await fetch('https://wbsapi.withings.net/measure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        action: 'getmeas',
        meastypes: '1,6,76', // Weight (1), Fat Mass (6), Muscle Mass (76)
        category: '1',
        lastupdate: '0'
      })
    });

    const measureData = await measureResponse.json();
    console.log('📊 Measurements response:', JSON.stringify(measureData, null, 2));

    if (measureData.status !== 0) {
      throw new Error(`Failed to get measurements: ${JSON.stringify(measureData)}`);
    }

    // Process the measurements
    let latestMeasurement = null;
    if (measureData.body && measureData.body.measuregrps && measureData.body.measuregrps.length > 0) {
      const latestGroup = measureData.body.measuregrps[0];
      const measures = latestGroup.measures;

      const measurement = {
        weight: null,
        fat_percentage: null,
        muscle_percentage: null
      };

      for (const measure of measures) {
        const value = measure.value * Math.pow(10, measure.unit);
        switch (measure.type) {
          case 1: // Weight
            measurement.weight = value;
            break;
          case 6: // Fat Mass
            measurement.fat_percentage = value;
            break;
          case 76: // Muscle Mass
            measurement.muscle_percentage = value;
            break;
        }
      }

      latestMeasurement = measurement;
    }

    console.log('✅ Processed measurement:', latestMeasurement);

    return new Response(
      JSON.stringify({ measurement: latestMeasurement }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('❌ Error in measurements function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});