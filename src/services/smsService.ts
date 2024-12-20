import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Appointment } from '../types/exam';

export const sendSMSReminder = async (appointment: Appointment, minutesBefore: number) => {
  if (!appointment.contactInfo?.phone) return;

  try {
    const { error } = await supabase.functions.invoke('send-sms-reminder', {
      body: {
        to: appointment.contactInfo.phone,
        appointment: {
          type: appointment.examType,
          date: format(new Date(appointment.date), 'PPp'),
          location: appointment.location,
          imagingCenter: appointment.imagingCenter
        },
        minutesBefore
      }
    });

    if (error) {
      console.error('Failed to send SMS reminder:', error);
      throw error;
    }

    console.log(`SMS reminder sent successfully to ${appointment.contactInfo.phone}`);
  } catch (error) {
    console.error('Error sending SMS reminder:', error);
    throw error;
  }
};