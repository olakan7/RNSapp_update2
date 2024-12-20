import React, { useEffect, useState } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { healthFinderAPI } from '../../services/healthFinder/api';
import { HealthTopic } from '../../services/healthFinder/types';
import { FileText, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const HealthTopics: React.FC = () => {
  const { selectedExam } = useExamStore();
  const [topics, setTopics] = useState<HealthTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const data = await healthFinderAPI.getTopics(selectedExam || 'radiology');
        setTopics(data);
      } catch (error) {
        console.error('Error fetching health topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [selectedExam]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-orange-100 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-orange-100 rounded"></div>
          <div className="h-4 bg-orange-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (topics.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-orange-600" />
        <h3 className="text-xl font-semibold text-orange-800">Health Information</h3>
      </div>

      <div className="grid gap-6">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:border-orange-200 transition-colors"
          >
            <h4 className="text-lg font-semibold text-orange-800 mb-3">{topic.title}</h4>
            <div 
              className="prose prose-sm max-w-none mb-4 text-gray-600"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {topic.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
              {topic.lastUpdate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Updated: {format(new Date(topic.lastUpdate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a
                href={`https://health.gov/myhealthfinder/topics/${topic.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                <span>Read more</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};