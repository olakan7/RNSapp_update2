import { ProviderDataItem } from '../providerData/types';
import { ExamType } from '../../types/exam';
import { PROVIDER_API_CONFIG } from '../providerData/config';

class HHSProviderAPI {
  private static instance: HHSProviderAPI;
  private readonly baseUrl = 'https://data.healthit.gov/api/1/metastore/schemas';
  private readonly cache = new Map<string, { data: ProviderDataItem[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): HHSProviderAPI {
    if (!HHSProviderAPI.instance) {
      HHSProviderAPI.instance = new HHSProviderAPI();
    }
    return HHSProviderAPI.instance;
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HHS API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  private getExamTypeQuery(examType: ExamType): string {
    const queryMap = {
      mri: 'magnetic_resonance_imaging',
      ct: 'computed_tomography',
      ultrasound: 'ultrasound',
      xray: 'radiography'
    };
    return queryMap[examType] || examType;
  }

  public async getProviders(zip?: string, examType?: ExamType): Promise<ProviderDataItem[]> {
    const cacheKey = `${zip || 'all'}-${examType || 'all'}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // For now, return fallback data since the HHS API requires proper authentication
      let providers = PROVIDER_API_CONFIG.fallbackData;

      // Filter by ZIP if provided
      if (zip) {
        providers = providers.filter(provider => 
          provider.zip.slice(0, 3) === zip.slice(0, 3)
        );
      }

      // Filter by exam type if provided
      if (examType) {
        providers = providers.filter(provider => 
          provider.services.some(service => 
            service.toLowerCase().includes(examType.toLowerCase())
          )
        );
      }

      this.cache.set(cacheKey, {
        data: providers,
        timestamp: Date.now()
      });

      return providers;
    } catch (error) {
      console.error('Error fetching from HHS Provider API:', error);
      return PROVIDER_API_CONFIG.fallbackData;
    }
  }

  private transformProviderData(item: any): ProviderDataItem {
    const costs = {
      mri: item.mri_cost ? { min: item.mri_cost_min, max: item.mri_cost_max } : undefined,
      ct: item.ct_cost ? { min: item.ct_cost_min, max: item.ct_cost_max } : undefined,
      xray: item.xray_cost ? { min: item.xray_cost_min, max: item.xray_cost_max } : undefined,
      ultrasound: item.ultrasound_cost ? { min: item.ultrasound_cost_min, max: item.ultrasound_cost_max } : undefined
    };

    return {
      id: item.provider_id || String(Math.random()),
      name: item.facility_name || item.name,
      address: item.address_line1 || item.address,
      city: item.city,
      state: item.state,
      zip: item.zip_code || item.zip,
      phone: item.phone_number || item.phone,
      services: Array.isArray(item.services) ? item.services : [],
      specialties: Array.isArray(item.specialties) ? item.specialties : [],
      acceptingNewPatients: item.accepting_new_patients === true,
      costs: Object.fromEntries(
        Object.entries(costs).filter(([_, value]) => value !== undefined)
      )
    };
  }
}

export const hhsProviderAPI = HHSProviderAPI.getInstance();