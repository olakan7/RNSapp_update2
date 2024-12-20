export const PLACES_API_CONFIG = {
  baseUrl: 'https://places.googleapis.com/v1/places:searchNearby',
  searchTypes: ['health', 'doctor'],
  keywords: ['radiology', 'imaging center', 'diagnostic imaging'],
  rankPreference: 'DISTANCE',
  maxResultCount: 10
};