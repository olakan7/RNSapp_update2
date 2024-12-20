import React from 'react';
import { useExamStore } from './store/useExamStore';
import { Header } from './components/Header';
import { ExamSelector } from './components/ExamSelector';
import { ExamInstructions } from './components/ExamInstructions';
import { HealthResources } from './components/HealthResources';
import { LocationSearch } from './components/LocationSearch';
import { Footer } from './components/Footer';

function App() {
  const { selectedExam } = useExamStore();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {selectedExam ? (
          <div className="space-y-6">
            <ExamInstructions />
            <LocationSearch />
          </div>
        ) : (
          <div className="space-y-6">
            <ExamSelector />
            <LocationSearch />
            <HealthResources />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;