import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

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

    // Create email content
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Appointment Reminder</h2>
          <p>This is a reminder for your upcoming ${appointment.type.toUpperCase()} appointment in ${minutesBefore} minutes.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Time:</strong> ${appointment.date}</p>
            <p><strong>Location:</strong> ${appointment.imagingCenter}</p>
            <p><strong>Address:</strong> ${appointment.location}</p>
            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          </div>
          <p style="color: #666;">Please arrive 15 minutes before your scheduled appointment time.</p>
        </body>
      </html>
    `;

    // Send email using Supabase's built-in email service
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error } = await supabase.auth.admin.sendRawEmail({
      email: to,
      subject: `Reminder: Upcoming ${appointment.type.toUpperCase()} Appointment`,
      html: emailContent,
    });

    if (error) throw error;

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