import React from 'react';
import { useExamStore } from '../store/useExamStore';
import { ArrowLeft, FileX } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedExam, setSelectedExam } = useExamStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            {selectedExam && (
              <button
                onClick={() => setSelectedExam(null)}
                className="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full p-1"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <FileX className="w-8 h-8 text-orange-600 hidden sm:block" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-orange-600 leading-tight">
                  Radiology Imaging Prep Guide
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Your Complete Preparation Assistant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}