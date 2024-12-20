import { notificationPreferencesService } from '../notificationPreferencesService';

export const getNotificationPreferences = async () => {
  try {
    return await notificationPreferencesService.getUserPreferences();
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
};