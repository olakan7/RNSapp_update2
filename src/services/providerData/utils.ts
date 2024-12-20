import { ProviderDataItem } from './types';
import { ExamType } from '../../types/exam';
import { PROVIDER_API_CONFIG } from './config';

export const buildQueryParams = (zip?: string, examType?: ExamType) => {
  const params = { ...PROVIDER_API_CONFIG.defaultParams };

  const conditions = [];
  
  if (zip) {
    conditions.push({
      zip_code: {
        $like: `${zip.slice(0, 3)}%`
      }
    });
  }

  if (examType) {
    conditions.push({
      services: {
        $like: `%${examType.toUpperCase()}%`
      }
    });
  }

  if (conditions.length > 0) {
    params.conditions = JSON.stringify(conditions);
  }

  return params;
};

export const transformProviderData = (item: any): ProviderDataItem => {
  const services = parseServices(item.services);
  const costs = parseCosts(item.costs, services);

  return {
    id: item.facility_id || item.id || String(Math.random()),
    name: item.facility_name || item.organization_name || item.name || 'Unknown Provider',
    address: item.address_line1 || item.street_address || item.address || '',
    city: item.city || '',
    state: item.state || '',
    zip: item.zip_code || item.zip || '',
    phone: item.phone_number || item.phone || '',
    services,
    specialties: parseArray(item.specialties || []),
    acceptingNewPatients: item.accepting_new_patients !== false,
    costs
  };
};

const parseServices = (services: any): string[] => {
  if (!services) return [];
  if (Array.isArray(services)) return services;
  try {
    const parsed = JSON.parse(services);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return String(services)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.toUpperCase());
  }
};

const parseArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [String(value)];
  }
};

const parseCosts = (costs: any, services: string[]) => {
  if (costs && typeof costs === 'object') {
    return costs;
  }

  // Generate estimated costs based on services
  const estimatedCosts: Record<string, { min: number; max: number }> = {};
  
  if (services.includes('MRI')) {
    estimatedCosts.mri = { min: 1200, max: 3000 };
  }
  if (services.includes('CT SCAN') || services.includes('CT')) {
    estimatedCosts.ct = { min: 800, max: 2500 };
  }
  if (services.includes('X-RAY') || services.includes('XRAY')) {
    estimatedCosts.xray = { min: 100, max: 500 };
  }
  if (services.includes('ULTRASOUND')) {
    estimatedCosts.ultrasound = { min: 200, max: 1000 };
  }

  return estimatedCosts;
};