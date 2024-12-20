import React, { useState } from 'react';
import { providerApi } from '../../services/providers/api';
import { ProviderLocation } from '../../services/providers/types';
import { SearchForm } from './SearchForm';
import { ProviderCard } from './ProviderCard';

export const LocationSearch: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [providers, setProviders] = useState<ProviderLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode || zipCode.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await providerApi.searchProviders({ zipCode });
      setProviders(results);
      if (results.length === 0) {
        setError('No imaging centers found in this area. Please try a different ZIP code.');
      }
    } catch (err) {
      setError('Unable to find imaging centers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Find Imaging Centers</h2>
      
      <SearchForm
        zipCode={zipCode}
        onZipCodeChange={setZipCode}
        onSubmit={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
};