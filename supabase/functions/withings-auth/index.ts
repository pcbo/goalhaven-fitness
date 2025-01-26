import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const clientId = Deno.env.get('WITHINGS_CLIENT_ID')!;
const redirectUri = 'https://stchvygpxhwqzlnlppka.supabase.co/functions/v1/withings-callback';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔍 Starting Withings auth process...');
  console.log('🔑 Client ID:', clientId);
  console.log('🔗 Using hardcoded redirect URI:', redirectUri);

  const state = crypto.randomUUID();
  const authUrl = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.metrics&state=${state}`;

  console.log('🎯 Generated auth URL:', authUrl);

  return new Response(
    JSON.stringify({ url: authUrl }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});