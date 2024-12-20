import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Twilio } from 'https://deno.land/x/twilio@1.0.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, appointment, minutesBefore } = await req.json();

    // Validate input
    if (!to || !appointment || !minutesBefore) {
      throw new Error('Missing required fields');
    }

    const twilio = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') || '',
      Deno.env.get('TWILIO_AUTH_TOKEN') || ''
    );

    const message = `Reminder: Your ${appointment.type.toUpperCase()} appointment is in ${minutesBefore} minutes.\nTime: ${appointment.date}\nLocation: ${appointment.imagingCenter}\nAddress: ${appointment.location}`;

    await twilio.messages.create({
      body: message,
      to,
      from: Deno.env.get('TWILIO_PHONE_NUMBER') || ''
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});