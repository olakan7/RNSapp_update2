// Environment configuration with defaults
export const config = {
  email: {
    sendgridApiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
    fromEmail: 'notifications@radiologynetworkservices.com',
  },
  sms: {
    twilioAccountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
  },
  isDevelopment: import.meta.env.DEV,
};