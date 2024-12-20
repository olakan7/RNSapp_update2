import { supabase } from '../../lib/supabase';
import { Appointment } from '../../types/exam';
import { NotificationService } from './types';
import { format } from 'date-fns';

class SMSNotificationService implements NotificationService {
  type = 'sms' as const;

  async sendReminder(appointment: Appointment, minutesBefore: number): Promise<void> {
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

      if (error) throw error;

      // Log successful notification
      await this.logNotification(appointment.id, 'success');
    } catch (error) {
      console.error('Failed to send SMS reminder:', error);
      await this.logNotification(appointment.id, 'failed', error.message);
    }
  }

  private async logNotification(appointmentId: string, status: 'success' | 'failed', errorMessage?: string) {
    await supabase.from('notification_logs').insert({
      appointment_id: appointmentId,
      notification_type: 'sms',
      status,
      error_message: errorMessage
    });
  }
}

export const smsService = new SMSNotificationService();