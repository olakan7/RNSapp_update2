export const CMS_API_CONFIG = {
  baseUrl: 'https://data.cms.gov/provider-data/api/1/datastore/sql',
  dataset: 'xubh-q36u', // Hospital General Information
  query: (zipCode?: string) => {
    const baseQuery = `
      SELECT 
        "Facility ID" as id,
        "Facility Name" as name,
        "Address" as street,
        "City" as city,
        "State" as state,
        "ZIP Code" as zipCode,
        "Phone Number" as phone
      FROM xubh-q36u
      WHERE "Hospital Type" = 'Acute Care Hospitals'
    `;
    
    return zipCode 
      ? `${baseQuery} AND "ZIP Code" LIKE '${zipCode.slice(0, 3)}%' LIMIT 10`
      : `${baseQuery} LIMIT 10`;
  }
};