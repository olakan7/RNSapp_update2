import React, { useEffect, useState } from 'react';
import { medicareAPI } from '../services/medicare/api';
import { MedicareData } from '../services/medicare/types';
import { Building2, AlertCircle } from 'lucide-react';
import { MedicareSearchForm } from './medicare/MedicareSearchForm';
import { MedicareProviderCard } from './medicare/MedicareProviderCard';

export const MedicareDataDisplay: React.FC = () => {
  const [medicareData, setMedicareData] = useState<MedicareData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');

  const fetchData = async (zip?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicareAPI.getMedicareData(zip);
      setMedicareData(data);
    } catch (err) {
      setError('Unable to load Medicare data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode && zipCode.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    fetchData(zipCode);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-orange-600">Medicare Provider Data</h2>
        </div>
        <MedicareSearchForm
          zipCode={zipCode}
          onZipCodeChange={setZipCode}
          onSubmit={handleSearch}
        />
      </div>

      {error && (
        <div className="flex items-center justify-center space-x-2 text-red-600 mb-6 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading Medicare data...</div>
        </div>
      ) : medicareData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Medicare providers found{zipCode ? ` in ${zipCode}` : ''}
        </div>
      ) : (
        <div className="grid gap-4">
          {medicareData.map((provider) => (
            <MedicareProviderCard key={provider.provider_id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
};