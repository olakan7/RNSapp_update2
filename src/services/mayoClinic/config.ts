export const MAYO_CLINIC_CONFIG = {
  baseUrl: 'https://api.mayoclinic.org/v1',
  endpoints: {
    articles: '/articles',
    conditions: '/conditions',
  },
  examTypeMapping: {
    mri: ['magnetic-resonance-imaging', 'mri-safety'],
    ct: ['computed-tomography', 'ct-scan'],
    ultrasound: ['ultrasound', 'sonography'],
    xray: ['x-ray', 'radiography'],
  },
} as const;