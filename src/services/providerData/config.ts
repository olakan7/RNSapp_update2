export const PROVIDER_API_CONFIG = {
  // Using a more reliable endpoint structure
  baseUrl: 'https://data.cms.gov/data-api/v1/dataset/c14e-6492/data',
  defaultParams: {
    // Updated query parameters for the new API structure
    limit: '20',
    offset: '0',
    sort: 'facility_name',
  },
  fallbackProviders: [
    {
      id: 'demo-1',
      name: 'Advanced Imaging Center',
      address: '123 Medical Plaza',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      phone: '(555) 123-4567',
      services: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound'],
      specialties: ['Diagnostic Imaging'],
      acceptingNewPatients: true,
      costs: {
        mri: { min: 1200, max: 3000 },
        ct: { min: 800, max: 2500 },
        xray: { min: 100, max: 500 },
        ultrasound: { min: 200, max: 1000 }
      }
    },
    {
      id: 'demo-2',
      name: 'City Medical Imaging',
      address: '456 Healthcare Drive',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '(555) 987-6543',
      services: ['MRI', 'CT Scan', 'X-Ray'],
      specialties: ['Diagnostic Imaging'],
      acceptingNewPatients: true,
      costs: {
        mri: { min: 1100, max: 2800 },
        ct: { min: 750, max: 2300 },
        xray: { min: 90, max: 450 }
      }
    }
  ]
} as const;