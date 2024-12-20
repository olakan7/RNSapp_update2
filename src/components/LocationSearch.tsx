import React, { useState } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';
import { providerApi } from '../services/providers/api';
import { ProviderLocation } from '../services/providers/types';

export const LocationSearch: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [providers, setProviders] = useState<ProviderLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await providerApi.searchProviders({ zipCode });
      setProviders(results);
    } catch (err) {
      setError('Unable to find imaging centers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Find Imaging Centers</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter ZIP code"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="p-4 border border-orange-100 rounded-lg hover:bg-orange-50">
            <h3 className="font-semibold text-lg text-orange-800">{provider.name}</h3>
            <div className="mt-2 space-y-2 text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p>{provider.address.street}</p>
                  <p>{provider.address.city}, {provider.address.state} {provider.address.zipCode}</p>
                </div>
              </div>
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${provider.phone}`} className="text-orange-600 hover:text-orange-700">
                    {provider.phone}
                  </a>
                </div>
              )}
            </div>
            {provider.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {provider.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};