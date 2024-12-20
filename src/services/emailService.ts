import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Appointment } from '../types/exam';

export const sendEmailReminder = async (appointment: Appointment, minutesBefore: number) => {
  if (!appointment.contactInfo?.email) return;

  try {
    const { error } = await supabase.functions.invoke('send-email-reminder', {
      body: {
        to: appointment.contactInfo.email,
        appointment: {
          type: appointment.examType,
          date: format(new Date(appointment.date), 'PPp'),
          location: appointment.location,
          imagingCenter: appointment.imagingCenter,
          notes: appointment.notes
        },
        minutesBefore
      }
    });

    if (error) {
      console.error('Failed to send email reminder:', error);
      throw error;
    }

    console.log(`Email reminder sent successfully to ${appointment.contactInfo.email}`);
  } catch (error) {
    console.error('Error sending email reminder:', error);
    throw error;
  }
};