import { format } from 'date-fns';
import { Appointment } from '../../types/exam';
import { NotificationService } from './types';

class BrowserNotificationService implements NotificationService {
  type = 'browser' as const;

  private async playSound(soundFile: string): Promise<void> {
    try {
      const audio = new Audio(`/sounds/${soundFile}`);
      await audio.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  async sendReminder(appointment: Appointment, minutesBefore: number): Promise<void> {
    if (Notification.permission !== 'granted') return;

    const soundMap = new Map([
      [1440, 'notification-1.mp3'],
      [60, 'notification-2.mp3'],
      [30, 'notification-3.mp3'],
      [15, 'notification-4.mp3'],
      [5, 'equipment-alert.mp3']
    ]);

    const sound = soundMap.get(minutesBefore);
    if (sound) {
      await this.playSound(sound);
    }

    new Notification(`Upcoming ${appointment.examType.toUpperCase()} Appointment`, {
      body: `Your appointment at ${appointment.imagingCenter} is in ${minutesBefore} minutes.\nLocation: ${appointment.location}`,
      icon: '/notification-icon.png',
      badge: '/badge-icon.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
    });
  }
}

export const browserService = new BrowserNotificationService();