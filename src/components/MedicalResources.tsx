import React, { useState, useEffect } from 'react';
import { mayoClinicAPI } from '../services/mayoClinic/api';
import { useExamStore } from '../store/useExamStore';
import { FileText, ExternalLink } from 'lucide-react';
import { MayoClinicArticle } from '../services/mayoClinic/types';

export const MedicalResources: React.FC = () => {
  const { selectedExam } = useExamStore();
  const [articles, setArticles] = useState<MayoClinicArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedExam) return;

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mayoClinicAPI.getExamInformation(selectedExam);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch articles'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedExam]);

  if (!selectedExam || isLoading || error || !articles?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-orange-600">Medical Resources</h2>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              {article.title}
            </h3>
            <p className="text-gray-700 line-clamp-3">{article.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 text-orange-600 hover:text-orange-700"
            >
              <span>Read more on Mayo Clinic</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};