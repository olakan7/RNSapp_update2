import React from 'react';

interface Props {
  zipCode: string;
  onZipCodeChange: (zip: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MedicareSearchForm: React.FC<Props> = ({ zipCode, onZipCodeChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex space-x-2">
    <input
      type="text"
      value={zipCode}
      onChange={(e) => onZipCodeChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
      placeholder="Enter ZIP code"
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      Search
    </button>
  </form>
);