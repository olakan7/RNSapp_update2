import { Appointment } from '../../types/exam';
import { addMinutes } from 'date-fns';
import { NOTIFICATION_TIMES } from './constants';
import { getNotificationPreferences } from './preferences';

class ReminderScheduler {
  private worker: ServiceWorker | null = null;

  async initialize() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/serviceWorker.js');
        await registration.periodicSync.register('check-notifications', {
          minInterval: 60000 // Check every minute
        });
        this.worker = registration.active;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async scheduleReminders(appointment: Appointment) {
    if (!appointment?.date) {
      console.error('Invalid appointment date');
      return;
    }

    const preferences = await getNotificationPreferences();
    if (!preferences?.browserEnabled) return;

    const appointmentDate = new Date(appointment.date);

    NOTIFICATION_TIMES.forEach(({ minutes }) => {
      const notificationTime = addMinutes(appointmentDate, -minutes);
      const now = new Date();

      if (notificationTime > now) {
        this.scheduleNotification({
          appointmentId: appointment.id,
          appointment,
          scheduledTime: notificationTime.getTime(),
          minutesBefore: minutes
        });
      }
    });
  }

  private scheduleNotification(notification: any) {
    if (this.worker) {
      this.worker.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        notification
      });
    }
  }
}

export const reminderScheduler = new ReminderScheduler();