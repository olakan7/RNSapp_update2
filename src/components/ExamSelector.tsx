import React from 'react';
import { useExamStore } from '../store/useExamStore';
import { examData } from '../data/examData';
import { ScanFace, Syringe, Stethoscope, FileX } from 'lucide-react';

const examIcons = {
  mri: ScanFace,
  ct: Syringe,
  ultrasound: Stethoscope,
  xray: FileX,
};

export const ExamSelector: React.FC = () => {
  const { setSelectedExam } = useExamStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {examData.map((exam) => {
        const Icon = examIcons[exam.type];

        return (
          <button
            key={exam.type}
            onClick={() => setSelectedExam(exam.type)}
            className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-orange-100 hover:border-orange-200 w-full"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                <Icon className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900">{exam.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{exam.duration}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}