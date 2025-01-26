import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const clientId = Deno.env.get('WITHINGS_CLIENT_ID')!;
const redirectUri = `https://wbsapi.withings.net/v2/oauth2`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔍 Using Withings API endpoint:', redirectUri);

  const state = crypto.randomUUID();
  const authUrl = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.metrics&state=${state}`;

  console.log('🎯 Generated auth URL:', authUrl);

  return new Response(
    JSON.stringify({ url: authUrl }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});