import { Appointment } from '../types/exam';
import { NOTIFICATION_TIMES } from './notifications/constants';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleAppointmentReminders = async (appointment: Appointment) => {
  if (!appointment?.date) {
    console.error('Invalid appointment date');
    return;
  }

  try {
    const appointmentDate = new Date(appointment.date).getTime();
    const now = new Date().getTime();

    NOTIFICATION_TIMES.forEach(({ minutes }) => {
      const reminderTime = appointmentDate - (minutes * 60 * 1000);
      
      if (reminderTime > now) {
        const timeoutId = setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`Upcoming ${appointment.examType.toUpperCase()} Appointment`, {
              body: `Your appointment is in ${minutes === 60 ? '1 hour' : minutes + ' minutes'} at ${appointment.imagingCenter}`,
              icon: '/notification-icon.png'
            });
          }
        }, reminderTime - now);

        // Store the timeout ID for cleanup
        window.__reminderTimeouts = window.__reminderTimeouts || new Map();
        window.__reminderTimeouts.set(`${appointment.id}-${minutes}`, timeoutId);
      }
    });
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
};

export const cancelAppointmentReminders = (appointmentId: string) => {
  if (!window.__reminderTimeouts) return;

  // Clear all timeouts for this appointment
  for (const [key, timeoutId] of window.__reminderTimeouts.entries()) {
    if (key.startsWith(appointmentId)) {
      clearTimeout(timeoutId);
      window.__reminderTimeouts.delete(key);
    }
  }
};

// Add cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    if (window.__reminderTimeouts) {
      for (const timeoutId of window.__reminderTimeouts.values()) {
        clearTimeout(timeoutId);
      }
    }
  });
}