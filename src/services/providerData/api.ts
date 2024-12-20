import { ProviderDataItem } from './types';
import { ExamType } from '../../types/exam';
import { PROVIDER_API_CONFIG } from './config';
import { buildQueryParams, transformProviderData } from './utils';

class ProviderDataAPI {
  private static instance: ProviderDataAPI;
  private readonly cache = new Map<string, { data: ProviderDataItem[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): ProviderDataAPI {
    if (!ProviderDataAPI.instance) {
      ProviderDataAPI.instance = new ProviderDataAPI();
    }
    return ProviderDataAPI.instance;
  }

  async getProviders(zip?: string, examType?: ExamType): Promise<ProviderDataItem[]> {
    // Always return fallback data for now since the CMS API requires authentication
    return this.getFallbackProviders(zip, examType);
  }

  private getFallbackProviders(zip?: string, examType?: ExamType): ProviderDataItem[] {
    let providers = [...PROVIDER_API_CONFIG.fallbackProviders];

    if (zip) {
      providers = providers.filter(p => p.zip.startsWith(zip.slice(0, 3)));
    }

    if (examType) {
      providers = providers.filter(p => 
        p.services.some(s => s.toLowerCase().includes(examType.toLowerCase()))
      );
    }

    return providers;
  }
}

export const providerDataAPI = ProviderDataAPI.getInstance();