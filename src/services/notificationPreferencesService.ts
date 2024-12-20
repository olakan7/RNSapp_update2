import { supabase } from '../lib/supabase';

export const notificationPreferencesService = {
  async getUserPreferences() {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updatePreferences(preferences: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    browserEnabled?: boolean;
    reminderTimes?: number[];
  }) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        email_enabled: preferences.emailEnabled,
        sms_enabled: preferences.smsEnabled,
        browser_enabled: preferences.browserEnabled,
        reminder_times: preferences.reminderTimes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};