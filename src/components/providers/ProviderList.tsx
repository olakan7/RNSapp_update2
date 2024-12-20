import React, { useState, useEffect } from 'react';
import { providerDataAPI } from '../../services/providerData/api';
import { ProviderDataItem } from '../../services/providerData/types';
import { useExamStore } from '../../store/useExamStore';
import { Building2, Phone, MapPin, Search, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ProviderList: React.FC = () => {
  const { selectedExam } = useExamStore();
  const [providers, setProviders] = useState<ProviderDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');

  const fetchProviders = async (zip?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await providerDataAPI.getProviders(zip, selectedExam || undefined);
      setProviders(data);
    } catch (err) {
      setError('Unable to load provider data. Please try again later.');
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(zipCode || undefined);
  }, [selectedExam, zipCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode && zipCode.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    fetchProviders(zipCode || undefined);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-orange-600">
            {selectedExam ? `${selectedExam.toUpperCase()} Providers` : 'Imaging Providers'}
          </h2>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter ZIP code"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-center justify-center space-x-2 text-red-600 mb-6 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading providers...</div>
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No providers found{zipCode ? ` in ${zipCode}` : ''}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                {provider.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <p>
                    {provider.address}<br />
                    {provider.city}, {provider.state} {provider.zip}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${provider.phone}`}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    {provider.phone}
                  </a>
                </div>
                {provider.costs && selectedExam && provider.costs[selectedExam] && (
                  <div className="flex items-start space-x-2">
                    <DollarSign className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        Estimated cost:{' '}
                        {formatCurrency(provider.costs[selectedExam].min)} - {formatCurrency(provider.costs[selectedExam].max)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {provider.services && provider.services.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};