import React, { useState, useEffect } from 'react';
import { mayoClinicAPI } from '../../services/mayoClinic/api';
import { useExamStore } from '../../store/useExamStore';
import { Stethoscope } from 'lucide-react';
import { MayoClinicArticle } from '../../services/mayoClinic/types';
import { ContentExcerpt } from './ContentExcerpt';

export const MayoClinicResources: React.FC = () => {
  const { selectedExam } = useExamStore();
  const [articles, setArticles] = useState<MayoClinicArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedExam) return;

    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await mayoClinicAPI.getExamInformation(selectedExam);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching Mayo Clinic articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedExam]);

  if (isLoading || !articles?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Stethoscope className="w-5 h-5 text-orange-600" />
        <h3 className="text-xl font-semibold text-orange-800">Mayo Clinic Resources</h3>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <ContentExcerpt
            key={article.id}
            title={article.title}
            content={article.content}
            url={article.url}
            lastUpdated={article.lastUpdated}
            tags={article.topics}
          />
        ))}
      </div>
    </div>
  );
};