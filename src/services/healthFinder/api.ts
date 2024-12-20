import { HealthTopic } from './types';

const API_BASE_URL = 'https://health.gov/myhealthfinder/api/v3';

export class HealthFinderAPI {
  private static instance: HealthFinderAPI;
  private readonly cache = new Map<string, { data: HealthTopic[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): HealthFinderAPI {
    if (!HealthFinderAPI.instance) {
      HealthFinderAPI.instance = new HealthFinderAPI();
    }
    return HealthFinderAPI.instance;
  }

  async getTopics(examType: string): Promise<HealthTopic[]> {
    try {
      // First try to get specific topic for radiology (ID: 527)
      const radiologyTopic = await this.getSpecificTopic('527');
      
      // Then get related topics based on exam type
      const topicMap: Record<string, string> = {
        mri: 'screening',
        ct: 'cancer',
        ultrasound: 'prevention',
        xray: 'bone health'
      };

      const searchTerm = topicMap[examType] || examType;
      const response = await fetch(
        `${API_BASE_URL}/topicsearch.json?keyword=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const searchTopics = data?.Result?.Resources?.Resource || [];
      
      // Combine radiology topic with search results
      return [
        ...(radiologyTopic ? [radiologyTopic] : []),
        ...searchTopics.map(this.transformTopic)
      ];
    } catch (error) {
      console.error('Error fetching health topics:', error);
      return [];
    }
  }

  private async getSpecificTopic(topicId: string): Promise<HealthTopic | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/topicsearch.json?TopicId=${topicId}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      const topic = data?.Result?.Resources?.Resource?.[0];
      
      return topic ? this.transformTopic(topic) : null;
    } catch (error) {
      console.error('Error fetching specific topic:', error);
      return null;
    }
  }

  private transformTopic(resource: any): HealthTopic {
    return {
      id: resource.Id,
      title: resource.Title,
      content: resource.Sections?.[0]?.Content || '',
      categories: resource.Categories || [],
      imageUrl: resource.ImageUrl,
      language: resource.Language || 'en',
      lastUpdate: resource.LastUpdate
    };
  }
}

export const healthFinderAPI = HealthFinderAPI.getInstance();