import React from 'react';
import { BookOpen } from 'lucide-react';
import { HHSContent } from './health/HHSContent';
import { MayoClinicResources } from './health/MayoClinicResources';

export const HealthResources: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-orange-600">Health Information Center</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HHSContent />
        <MayoClinicResources />
      </div>
    </div>
  );
};