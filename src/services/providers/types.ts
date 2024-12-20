export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProviderLocation {
  id: string;
  name: string;
  address: Address;
  phone: string;
  services: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}