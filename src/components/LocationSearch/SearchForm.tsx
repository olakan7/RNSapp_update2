import React from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  zipCode: string;
  onZipCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const SearchForm: React.FC<Props> = ({ 
  zipCode, 
  onZipCodeChange, 
  onSubmit, 
  loading 
}) => (
  <form onSubmit={onSubmit} className="mb-6">
    <div className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
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
);