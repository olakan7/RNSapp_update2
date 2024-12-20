import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { ProviderLocation } from '../../services/providers/types';

interface Props {
  provider: ProviderLocation;
}

export const ProviderCard: React.FC<Props> = ({ provider }) => (
  <div className="p-4 border border-orange-100 rounded-lg hover:bg-orange-50">
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
);