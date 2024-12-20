import React from 'react';
import { useExamStore } from '../store/useExamStore';
import { examData } from '../data/examData';
import { CheckCircle, Circle, DollarSign } from 'lucide-react';
import { MedicalResources } from './MedicalResources';

export const ExamInstructions: React.FC = () => {
  const { selectedExam } = useExamStore();
  const examInfo = examData.find((exam) => exam.type === selectedExam);

  if (!examInfo) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">{examInfo.name}</h2>
      <p className="text-gray-600 mb-4">{examInfo.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm text-gray-600">
              Cost: ${examInfo.cost.min} - ${examInfo.cost.max}
            </p>
            {examInfo.cost.withInsurance && (
              <p className="text-sm text-orange-600">
                With Insurance: ${examInfo.cost.withInsurance.min} - ${examInfo.cost.withInsurance.max}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-orange-800 mb-3">Instructions</h3>
          <div className="space-y-3">
            {examInfo.instructions.map((instruction) => (
              <div key={instruction.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Circle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{instruction.title}</p>
                  <p className="text-gray-600">{instruction.description}</p>
                  <p className="text-sm text-orange-600 mt-1">{instruction.timeframe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-orange-800 mb-3">Procedure Steps</h3>
          <div className="space-y-4">
            {examInfo.procedureSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MedicalResources />
      </div>
    </div>
  );
}