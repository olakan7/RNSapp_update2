import React, { useEffect, useState } from 'react';
import { hhsMediaAPI } from '../../services/hhs/api';
import { HHSMediaContent } from '../../services/hhs/types';
import { FileText } from 'lucide-react';
import { ContentExcerpt } from './ContentExcerpt';

const CONTENT_IDS = ['1713', '1754'];

export const HHSContent: React.FC = () => {
  const [contents, setContents] = useState<HHSMediaContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      const results = await Promise.all(
        CONTENT_IDS.map(id => hhsMediaAPI.getContent(id))
      );
      setContents(results.filter((content): content is HHSMediaContent => content !== null));
      setIsLoading(false);
    };

    fetchContents();
  }, []);

  if (isLoading || contents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-orange-600" />
        <h3 className="text-xl font-semibold text-orange-800">HHS Health Guidelines</h3>
      </div>

      <div className="space-y-6">
        {contents.map(content => (
          <ContentExcerpt
            key={content.id}
            title={content.title}
            content={content.content}
            description={content.description}
            lastUpdated={content.lastUpdated}
          />
        ))}
      </div>
    </div>
  );
};