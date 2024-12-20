import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { csvProviderParser } from '../../services/providerData/csvParser';

interface CSVUploaderProps {
  onDataLoaded: () => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await csvProviderParser.loadCSV(file);
      onDataLoaded();
    } catch (error) {
      console.error('Error loading CSV:', error);
      alert('Error loading provider data. Please check the file format and try again.');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="csv-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-orange-500" />
            <p className="mb-2 text-sm text-orange-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-orange-500">
              Diagnostic Radiology CSV file
            </p>
          </div>
          <input
            id="csv-upload"
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};