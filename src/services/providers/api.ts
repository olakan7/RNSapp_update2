import { ProviderLocation } from './types';
import { placesApi } from './places/api';
import { cmsApi } from './cms/api';
import { npiApi } from './npi/api';
import { mockProviders } from './mockData';
import { providerCache } from './cache';
import { retryOperation, mergeProviderResults } from './utils';
import { PROVIDER_API_CONFIG } from './config';

export const providerApi = {
  async searchProviders(params: { 
    zipCode?: string, 
    radius?: number 
  }): Promise<ProviderLocation[]> {
    const cacheKey = `${params.zipCode}-${params.radius || PROVIDER_API_CONFIG.searchRadius}`;
    const cachedResults = providerCache.get(cacheKey);
    if (cachedResults) return cachedResults;

    const apis = [
      { api: placesApi, name: 'Google Places' },
      { api: cmsApi, name: 'CMS' },
      { api: npiApi, name: 'NPI Registry' }
    ];

    const results = await Promise.allSettled(
      apis.map(({ api, name }) =>
        retryOperation(async () => {
          try {
            return await api.searchProviders(params);
          } catch (error) {
            console.warn(`${name} API failed:`, error);
            return [];
          }
        })
      )
    );

    const validResults = results
      .filter((result): result is PromiseFulfilledResult<ProviderLocation[]> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    let providers = mergeProviderResults(validResults);

    if (providers.length < PROVIDER_API_CONFIG.minResultCount) {
      if (params.zipCode) {
        providers = mockProviders.filter(provider => 
          provider.address.zipCode.startsWith(params.zipCode!.slice(0, 3))
        );
      } else {
        providers = mockProviders;
      }
    }

    providerCache.set(cacheKey, providers);
    return providers;
  }
};