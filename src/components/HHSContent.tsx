import React, { useEffect, useState } from 'react';
import { hhsMediaAPI } from '../services/hhs/api';
import { HHSMediaContent } from '../services/hhs/types';
import { FileText, Info } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Info className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-orange-600">Health Resources</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contents.map(content => (
          <div 
            key={content.id}
            className="bg-white rounded-lg overflow-hidden shadow-md border border-orange-100 flex flex-col"
          >
            <div className="p-6 bg-orange-50">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-800">
                  {content.title || 'Health Information'}
                </h3>
              </div>
              {content.description && (
                <p className="text-gray-600 text-sm">{content.description}</p>
              )}
            </div>
            <div className="p-6 flex-grow">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
            {content.lastUpdated && (
              <div className="px-6 py-3 bg-orange-50 border-t border-orange-100">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(content.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};