import { ProviderLocation } from './types';

interface CacheEntry {
  data: ProviderLocation[];
  timestamp: number;
}

export const providerCache = {
  cache: new Map<string, CacheEntry>(),

  get(key: string): ProviderLocation[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > 5 * 60 * 1000;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  },

  set(key: string, data: ProviderLocation[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};