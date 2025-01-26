import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const clientId = Deno.env.get('WITHINGS_CLIENT_ID')!;
const clientSecret = Deno.env.get('WITHINGS_CLIENT_SECRET')!;
const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/withings-callback`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "${error}" }, "*");</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "No code provided" }, "*");</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    const tokenResponse = await fetch('https://wbsapi.withings.net/v2/oauth2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'requesttoken',
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    return new Response(
      `<html><body><script>window.opener.postMessage({ token: "${tokenData.body.access_token}" }, "*");</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "${error.message}" }, "*");</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
});