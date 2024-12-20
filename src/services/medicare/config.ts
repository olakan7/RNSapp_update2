export const MEDICARE_API_CONFIG = {
  baseUrl: 'https://data.cms.gov/data-api/v1/dataset',
  datasetId: 'xkxk-h57x',
  defaultParams: {
    limit: '10',
    offset: '0'
  }
} as const;

export const FALLBACK_DATA = [
  {
    provider_id: 'demo-1',
    facility_name: 'Medicare Health Center',
    address: '123 Medicare Ave',
    city: 'Springfield',
    state: 'IL',
    zip_code: '62701',
    average_medicare_payments: 2500,
    total_services: 150,
    total_beneficiaries: 75
  }
];