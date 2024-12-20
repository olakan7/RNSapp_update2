import { MAYO_CLINIC_CONFIG } from './config';
import { ExamType } from '../../types/exam';
import { ProviderDataItem } from '../providerData/types';

export class MayoClinicProviderAPI {
  private static instance: MayoClinicProviderAPI;
  private readonly apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_MAYO_CLINIC_API_KEY || '';
  }

  public static getInstance(): MayoClinicProviderAPI {
    if (!MayoClinicProviderAPI.instance) {
      MayoClinicProviderAPI.instance = new MayoClinicProviderAPI();
    }
    return MayoClinicProviderAPI.instance;
  }

  private async fetchWithAuth(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${MAYO_CLINIC_CONFIG.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Mayo Clinic API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching from Mayo Clinic API:', error);
      return null;
    }
  }

  public async getProviders(zip?: string, examType?: ExamType): Promise<ProviderDataItem[]> {
    const params: Record<string, string> = {
      limit: '20',
    };

    if (zip) {
      params.zip = zip;
    }

    if (examType) {
      params.service = MAYO_CLINIC_CONFIG.examTypeMapping[examType].join(',');
    }

    const response = await this.fetchWithAuth('/providers/imaging', params);

    if (!response?.providers) {
      return [];
    }

    return response.providers.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      address: provider.address.street,
      city: provider.address.city,
      state: provider.address.state,
      zip: provider.address.zip,
      phone: provider.phone,
      services: provider.services || [],
      specialties: provider.specialties || [],
      acceptingNewPatients: provider.acceptingNewPatients,
      costs: provider.costs || {},
    }));
  }
}

export const mayoClinicProviderAPI = MayoClinicProviderAPI.getInstance();