import { Appointment } from '../../types/exam';

export interface NotificationService {
  type: 'browser' | 'email' | 'sms';
  sendReminder: (appointment: Appointment, minutesBefore: number) => Promise<void>;
}