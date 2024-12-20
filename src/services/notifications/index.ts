export * from './types';
export * from './emailService';
export * from './smsService';
export * from './browserService';

import { browserService } from './browserService';
import { emailService } from './emailService';
import { smsService } from './smsService';

export const notificationServices = [
  browserService,
  emailService,
  smsService,
];