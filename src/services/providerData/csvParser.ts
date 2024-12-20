import { ProviderDataItem } from './types';
import Papa from 'papaparse';

export class CSVProviderParser {
  private static instance: CSVProviderParser;
  private providers: ProviderDataItem[] = [];
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): CSVProviderParser {
    if (!CSVProviderParser.instance) {
      CSVProviderParser.instance = new CSVProviderParser();
    }
    return CSVProviderParser.instance;
  }

  public async loadCSV(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          this.providers = results.data.map(this.transformCSVRow);
          this.isLoaded = true;
          resolve();
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  }

  private transformCSVRow(row: any): ProviderDataItem {
    return {
      id: row.NPI || String(Math.random()),
      name: row.Provider_Organization_Name || row.Provider_Name || 'Unknown Provider',
      address: row.Provider_First_Line_Business_Practice_Location_Address || '',
      city: row.Provider_Business_Practice_Location_Address_City_Name || '',
      state: row.Provider_Business_Practice_Location_Address_State_Name || '',
      zip: row.Provider_Business_Practice_Location_Address_Postal_Code || '',
      phone: row.Provider_Business_Practice_Location_Address_Telephone_Number || '',
      services: ['Diagnostic Radiology'],
      specialties: [row.Provider_Primary_Specialty || 'Radiology'].filter(Boolean),
      acceptingNewPatients: true,
      costs: {
        mri: { min: 800, max: 2500 },
        ct: { min: 500, max: 1800 },
        xray: { min: 100, max: 500 },
        ultrasound: { min: 200, max: 1000 }
      }
    };
  }

  public async searchProviders(query: { zip?: string, examType?: string }): Promise<ProviderDataItem[]> {
    if (!this.isLoaded) {
      throw new Error('CSV data not loaded. Please load the CSV file first.');
    }

    let results = [...this.providers];

    if (query.zip) {
      results = results.filter(provider => 
        provider.zip.slice(0, 3) === query.zip.slice(0, 3)
      );
    }

    if (query.examType) {
      results = results.filter(provider => 
        provider.services.some(service => 
          service.toLowerCase().includes(query.examType!.toLowerCase())
        )
      );
    }

    return results;
  }
}

export const csvProviderParser = CSVProviderParser.getInstance();