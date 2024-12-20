import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ContentExcerptProps {
  title: string;
  content: string;
  description?: string;
  url?: string;
  lastUpdated?: string;
  tags?: string[];
}

export const ContentExcerpt: React.FC<ContentExcerptProps> = ({
  title,
  content,
  description,
  url,
  lastUpdated,
  tags
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const excerpt = content.slice(0, 300) + (content.length > 300 ? '...' : '');

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-orange-100">
      <div className="p-6">
        <h4 className="text-lg font-semibold text-orange-800 mb-2">{title}</h4>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{ 
              __html: isExpanded ? content : excerpt 
            }}
            className={isExpanded ? '' : 'line-clamp-3'}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <span>View source</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {lastUpdated && (
        <div className="px-6 py-3 bg-orange-50 border-t border-orange-100">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};