export interface MayoClinicArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  lastUpdated: string;
  topics: string[];
  relatedConditions?: string[];
}

export interface MayoClinicResponse {
  articles: MayoClinicArticle[];
  total: number;
  page: number;
}