import React from 'react';
import { MedicareData } from '../../services/medicare/types';
import { MapPin, DollarSign } from 'lucide-react';
import { formatMedicarePayment } from '../../services/medicare/utils';

interface Props {
  provider: MedicareData;
}

export const MedicareProviderCard: React.FC<Props> = ({ provider }) => (
  <div className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors">
    <h3 className="font-semibold text-orange-800 mb-2">
      {provider.facility_name}
    </h3>
    <div className="space-y-2 text-gray-600">
      <div className="flex items-start space-x-2">
        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
        <p>
          {provider.address}<br />
          {provider.city}, {provider.state} {provider.zip_code}
        </p>
      </div>
      {provider.average_medicare_payments && (
        <div className="flex items-center space-x-2 text-orange-600">
          <DollarSign className="w-4 h-4" />
          <span>
            Average Medicare Payment: {formatMedicarePayment(provider.average_medicare_payments)}
          </span>
        </div>
      )}
    </div>
  </div>
);