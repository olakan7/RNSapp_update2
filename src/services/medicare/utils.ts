import { MEDICARE_API_CONFIG } from './config';

export const buildQueryParams = (zip?: string) => {
  const params = new URLSearchParams({
    ...MEDICARE_API_CONFIG.defaultParams
  });

  if (zip) {
    params.append('filter[zip_code][$like]', `${zip}%`);
  }

  return params;
};

export const formatMedicarePayment = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};