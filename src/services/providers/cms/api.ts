import { ProviderLocation } from '../types';
import { CMS_API_CONFIG } from './config';

export const cmsApi = {
  async searchProviders(params: { zipCode?: string }): Promise<ProviderLocation[]> {
    if (!params.zipCode) return [];

    try {
      const query = CMS_API_CONFIG.query(params.zipCode);
      const url = `${CMS_API_CONFIG.baseUrl}?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CMS API error: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      return data.map((item: any) => ({
        id: item.id || crypto.randomUUID(),
        name: item.name || 'Unknown Provider',
        address: {
          street: item.street || '',
          city: item.city || '',
          state: item.state || '',
          zipCode: item.zipCode || params.zipCode,
        },
        phone: item.phone || '',
        services: ['Radiology', 'Imaging'],
      }));
    } catch (error) {
      console.warn('CMS API error:', error);
      return [];
    }
  }
};