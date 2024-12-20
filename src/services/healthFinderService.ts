import { supabase } from '../lib/supabase';

const API_BASE_URL = 'https://health.gov/myhealthfinder/api/v3';

interface HealthTopic {
  id: string;
  title: string;
  content: string;
  categories: string[];
  imageUrl?: string;
}

interface MyHealthFinderResponse {
  Result: {
    Total: number;
    Resources: {
      Resource: Array<{
        Id: string;
        Title: string;
        Sections: Array<{ Content: string }>;
        Categories?: string[];
        ImageUrl?: string;
      }>;
    };
  };
}

export const healthFinderService = {
  async getRecommendations(examType: string): Promise<HealthTopic[]> {
    try {
      // First, try to get cached recommendations
      const { data: cachedData, error: cacheError } = await supabase
        .from('health_recommendations')
        .select('*')
        .eq('exam_type', examType);

      if (!cacheError && cachedData && cachedData.length > 0) {
        return cachedData.map(item => ({
          id: item.topic_id,
          title: item.title,
          content: item.content,
          categories: item.categories || [],
          imageUrl: item.image_url
        }));
      }

      // If no cached data, fetch from API
      const topicMap: Record<string, string> = {
        mri: 'screening',
        ct: 'cancer',
        ultrasound: 'prevention',
        xray: 'bone health'
      };

      const searchTerm = topicMap[examType] || examType;
      const response = await fetch(
        `${API_BASE_URL}/topicsearch.json?keyword=${encodeURIComponent(searchTerm)}&lang=en`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: MyHealthFinderResponse = await response.json();
      
      if (!data?.Result?.Resources?.Resource) {
        throw new Error('Invalid API response format');
      }

      const topics = data.Result.Resources.Resource.map(resource => ({
        id: resource.Id,
        title: resource.Title,
        content: resource.Sections?.[0]?.Content || '',
        categories: resource.Categories || [],
        imageUrl: resource.ImageUrl
      }));

      // Only cache if we got valid data
      if (topics.length > 0) {
        await this.cacheRecommendations(examType, topics);
      }

      return topics;
    } catch (error) {
      console.error('Error fetching health recommendations:', error);
      // Return empty array instead of throwing to prevent UI disruption
      return [];
    }
  },

  async cacheRecommendations(examType: string, topics: HealthTopic[]) {
    try {
      const { error } = await supabase
        .from('health_recommendations')
        .upsert(
          topics.map(topic => ({
            exam_type: examType,
            topic_id: topic.id,
            title: topic.title,
            content: topic.content,
            categories: topic.categories,
            image_url: topic.imageUrl
          })),
          { onConflict: 'exam_type,topic_id' }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error caching health recommendations:', error);
    }
  }
};