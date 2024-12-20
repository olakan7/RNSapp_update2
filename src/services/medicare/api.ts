import { MedicareData } from './types';
import { MEDICARE_API_CONFIG, FALLBACK_DATA } from './config';
import { buildQueryParams } from './utils';

class MedicareAPI {
  private static instance: MedicareAPI;
  
  private constructor() {}

  public static getInstance(): MedicareAPI {
    if (!MedicareAPI.instance) {
      MedicareAPI.instance = new MedicareAPI();
    }
    return MedicareAPI.instance;
  }

  async getMedicareData(zip?: string): Promise<MedicareData[]> {
    try {
      // Return fallback data for now since the API requires authentication
      return this.getFallbackData(zip);
    } catch (error) {
      console.error('Error fetching Medicare data:', error);
      return [];
    }
  }

  private getFallbackData(zip?: string): MedicareData[] {
    if (!zip) return FALLBACK_DATA;
    return FALLBACK_DATA.filter(provider => 
      provider.zip_code.startsWith(zip.slice(0, 3))
    );
  }
}

export const medicareAPI = MedicareAPI.getInstance();