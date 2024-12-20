import { ProviderLocation } from './types';
import { PROVIDER_API_CONFIG } from './config';

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  attempts: number = PROVIDER_API_CONFIG.retryAttempts
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (attempts <= 1) throw error;
    await delay(PROVIDER_API_CONFIG.retryDelay);
    return retryOperation(operation, attempts - 1);
  }
};

export const mergeProviderResults = (
  results: ProviderLocation[][]
): ProviderLocation[] => {
  const seen = new Set<string>();
  return results
    .flat()
    .filter(provider => {
      const key = `${provider.name}-${provider.address.zipCode}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};