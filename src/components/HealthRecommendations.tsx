import React, { useEffect, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { healthFinderService } from '../services/healthFinderService';
import { FileText, ExternalLink } from 'lucide-react';

interface HealthTopic {
  id: string;
  title: string;
  content: string;
  categories: string[];
  imageUrl?: string;
}

export const HealthRecommendations: React.FC = () => {
  const { selectedExam } = useExamStore();
  const [recommendations, setRecommendations] = useState<HealthTopic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!selectedExam) return;
      
      setLoading(true);
      try {
        const topics = await healthFinderService.getRecommendations(selectedExam);
        setRecommendations(topics);
        await healthFinderService.cacheRecommendations(selectedExam, topics);
      } catch (error) {
        console.error('Error fetching health recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedExam]);

  if (!selectedExam || loading) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-orange-600">Health Recommendations</h2>
      </div>

      <div className="space-y-6">
        {recommendations.map((topic) => (
          <div
            key={topic.id}
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              {topic.title}
            </h3>
            <div 
              className="text-gray-700 prose"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
            {topic.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {topic.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            <a
              href={`https://health.gov/myhealthfinder/topics/${topic.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 text-orange-600 hover:text-orange-700"
            >
              <span>Learn more</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};