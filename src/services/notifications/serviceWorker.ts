import { Appointment } from '../../types/exam';

declare const self: ServiceWorkerGlobalScope;

const NOTIFICATION_STORAGE_KEY = 'scheduled-notifications';

interface ScheduledNotification {
  appointmentId: string;
  appointment: Appointment;
  scheduledTime: number;
  minutesBefore: number;
}

// Handle scheduled notifications
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const notification: ScheduledNotification = event.data.notification;
    storeNotification(notification);
    scheduleNotification(notification);
  }
});

// Check for due notifications periodically
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkNotifications());
  }
});

async function storeNotification(notification: ScheduledNotification) {
  const stored = await getStoredNotifications();
  stored.push(notification);
  await self.registration.storage.persist();
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(stored));
}

async function getStoredNotifications(): Promise<ScheduledNotification[]> {
  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

async function checkNotifications() {
  const now = Date.now();
  const stored = await getStoredNotifications();
  
  const due = stored.filter(n => n.scheduledTime <= now);
  const pending = stored.filter(n => n.scheduledTime > now);
  
  // Update storage with remaining notifications
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(pending));
  
  // Send due notifications
  due.forEach(notification => {
    self.registration.showNotification(
      `Upcoming ${notification.appointment.examType.toUpperCase()} Appointment`,
      {
        body: `Your appointment at ${notification.appointment.imagingCenter} is in ${notification.minutesBefore} minutes.`,
        icon: '/notification-icon.png',
        badge: '/badge-icon.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
      }
    );
  });
}

function scheduleNotification(notification: ScheduledNotification) {
  const timeUntilNotification = notification.scheduledTime - Date.now();
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      checkNotifications();
    }, timeUntilNotification);
  }
}