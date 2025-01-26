import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const clientId = Deno.env.get('WITHINGS_CLIENT_ID')!;
const clientSecret = Deno.env.get('WITHINGS_CLIENT_SECRET')!;
const redirectUri = 'https://stchvygpxhwqzlnlppka.supabase.co/functions/v1/withings-callback';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "script-src 'unsafe-inline'; default-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Type': 'text/html',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('📥 Received callback request');
  
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  console.log('🔍 URL Parameters:', {
    code: code ? 'present' : 'missing',
    error: error || 'none',
    fullUrl: req.url
  });

  if (error) {
    console.error('❌ Error from Withings:', error);
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline'; default-src 'self' 'unsafe-inline'">
        </head>
        <body>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ error: "${error}" }, "*");
              }
            } catch (e) {
              console.error('Error posting message:', e);
            }
          </script>
        </body>
      </html>
    `, { headers: corsHeaders });
  }

  if (!code) {
    console.error('❌ No code provided in callback');
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline'; default-src 'self' 'unsafe-inline'">
        </head>
        <body>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ error: "No code provided" }, "*");
              }
            } catch (e) {
              console.error('Error posting message:', e);
            }
          </script>
        </body>
      </html>
    `, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Attempting to exchange code for token');
    
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
    console.log('📦 Token response:', JSON.stringify(tokenData, null, 2));
    
    if (tokenData.status !== 0) {
      console.error('❌ Error in token response:', tokenData);
      throw new Error(tokenData.error || 'Failed to obtain token');
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline'; default-src 'self' 'unsafe-inline'">
        </head>
        <body>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ token: "${tokenData.body.access_token}" }, "*");
              }
            } catch (e) {
              console.error('Error posting message:', e);
            }
          </script>
        </body>
      </html>
    `, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ Error in token exchange:', error);
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline'; default-src 'self' 'unsafe-inline'">
        </head>
        <body>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ error: "${error.message}" }, "*");
              }
            } catch (e) {
              console.error('Error posting message:', e);
            }
          </script>
        </body>
      </html>
    `, { headers: corsHeaders });
  }
});