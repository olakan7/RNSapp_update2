import { ProviderLocation } from '../types';
import { PLACES_API_CONFIG } from './config';

export const placesApi = {
  async searchProviders(params: { zipCode?: string }): Promise<ProviderLocation[]> {
    if (!params.zipCode || !import.meta.env.VITE_GOOGLE_MAPS_KEY) {
      return [];
    }

    try {
      // First get coordinates from ZIP code
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${params.zipCode}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status === 'REQUEST_DENIED') {
        throw new Error('Invalid API key');
      }

      if (!geocodeData.results?.[0]?.geometry?.location) {
        return [];
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;

      const searchBody = {
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 10000.0
          }
        },
        rankPreference: PLACES_API_CONFIG.rankPreference,
        maxResultCount: PLACES_API_CONFIG.maxResultCount,
        includedTypes: PLACES_API_CONFIG.searchTypes,
        textQuery: PLACES_API_CONFIG.keywords.join(' OR ')
      };

      const response = await fetch(PLACES_API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.phoneNumbers'
        },
        body: JSON.stringify(searchBody)
      });

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.places?.map((place: any) => ({
        id: place.id || crypto.randomUUID(),
        name: place.displayName?.text || 'Unknown Provider',
        address: {
          street: place.formattedAddress || '',
          city: '',
          state: '',
          zipCode: params.zipCode || ''
        },
        phone: place.phoneNumbers?.[0] || '',
        services: ['Diagnostic Imaging'],
        coordinates: place.location ? {
          latitude: place.location.latitude,
          longitude: place.location.longitude
        } : undefined
      })) || [];
    } catch (error) {
      console.warn('Places API error:', error);
      return [];
    }
  }
};