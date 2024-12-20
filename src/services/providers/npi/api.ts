import { ProviderLocation } from '../types';
import { NPI_API_CONFIG } from './config';

export const npiApi = {
  async searchProviders(params: { zipCode?: string }): Promise<ProviderLocation[]> {
    if (!params.zipCode) return [];

    try {
      const searchParams = new URLSearchParams({
        ...NPI_API_CONFIG.params,
        postal_code: params.zipCode,
      });

      const response = await fetch(`${NPI_API_CONFIG.baseUrl}/?${searchParams}`);
      if (!response.ok) {
        throw new Error(`NPI API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.results) {
        throw new Error('Invalid response format');
      }
      
      return data.results.map((item: any) => ({
        id: item.number || crypto.randomUUID(),
        name: item.basic?.organization_name || 'Unknown Provider',
        address: {
          street: item.addresses?.[0]?.address_1 || '',
          city: item.addresses?.[0]?.city || '',
          state: item.addresses?.[0]?.state || '',
          zipCode: item.addresses?.[0]?.postal_code || params.zipCode,
        },
        phone: item.addresses?.[0]?.telephone_number || '',
        services: item.taxonomies?.map((t: any) => t.desc) || ['Diagnostic Imaging'],
      }));
    } catch (error) {
      console.warn('NPI API error:', error);
      return [];
    }
  }
};