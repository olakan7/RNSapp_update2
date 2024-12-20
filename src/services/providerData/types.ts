export interface ProviderCosts {
  min: number;
  max: number;
}

export interface ProviderCostMap {
  mri?: ProviderCosts;
  ct?: ProviderCosts;
  xray?: ProviderCosts;
  ultrasound?: ProviderCosts;
}

export interface ProviderDataItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  services: string[];
  specialties?: string[];
  acceptingNewPatients?: boolean;
  costs?: ProviderCostMap;
}

export interface ProviderDataResponse {
  items: any[];
  total: number;
  page: number;
  metadata?: {
    lastUpdated?: string;
    source?: string;
  };
}