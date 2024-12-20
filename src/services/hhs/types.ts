export interface HHSMediaContent {
  id: string;
  content: string;
  title: string;
  description?: string;
  lastUpdated?: string;
}

export interface HHSSyndicateResponse {
  results: Array<{
    content: string;
    title: string;
    description?: string;
    dateModified?: string;
  }>;
}