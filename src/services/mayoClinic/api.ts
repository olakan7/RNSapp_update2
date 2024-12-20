import { MAYO_CLINIC_CONFIG } from './config';
import { MayoClinicArticle, MayoClinicResponse } from './types';
import { ExamType } from '../../types/exam';

export class MayoClinicAPI {
  private static instance: MayoClinicAPI;
  private readonly apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_MAYO_CLINIC_API_KEY || '';
  }

  public static getInstance(): MayoClinicAPI {
    if (!MayoClinicAPI.instance) {
      MayoClinicAPI.instance = new MayoClinicAPI();
    }
    return MayoClinicAPI.instance;
  }

  private async fetchWithAuth(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${MAYO_CLINIC_CONFIG.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

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
  }

  public async getExamInformation(examType: ExamType): Promise<MayoClinicArticle[]> {
    const searchTerms = MAYO_CLINIC_CONFIG.examTypeMapping[examType];
    const results: MayoClinicArticle[] = [];

    for (const term of searchTerms) {
      const response: MayoClinicResponse = await this.fetchWithAuth(
        MAYO_CLINIC_CONFIG.endpoints.articles,
        { query: term, limit: '5' }
      );
      results.push(...response.articles);
    }

    return results;
  }
}

export const mayoClinicAPI = MayoClinicAPI.getInstance();