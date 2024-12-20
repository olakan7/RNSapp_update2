export interface MedicareData {
  provider_id: string;
  facility_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  average_medicare_payments?: number;
  total_services?: number;
  total_beneficiaries?: number;
}