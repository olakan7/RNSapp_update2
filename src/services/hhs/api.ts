import { HHSMediaContent, HHSSyndicateResponse } from './types';

export const hhsMediaAPI = {
  async getContent(mediaId: string): Promise<HHSMediaContent | null> {
    try {
      const response = await fetch(
        `https://api.digitalmedia.hhs.gov/api/v2/resources/media/${mediaId}/syndicate.json?` +
        'stripStyles=true&stripScripts=false&stripBreaks=false&' +
        'stripImages=false&stripClasses=true&stripIds=false'
      );

      if (!response.ok) {
        throw new Error(`HHS API error: ${response.statusText}`);
      }

      const data: HHSSyndicateResponse = await response.json();
      
      if (!data?.results?.[0]) {
        return null;
      }

      return {
        id: mediaId,
        content: data.results[0].content,
        title: data.results[0].title,
        description: data.results[0].description,
        lastUpdated: data.results[0].dateModified
      };
    } catch (error) {
      console.error('Error fetching HHS content:', error);
      return null;
    }
  }
};