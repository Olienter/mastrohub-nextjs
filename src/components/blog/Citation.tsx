'use client';

import { ExternalLink, Globe, FileText } from 'lucide-react';

interface CitationProps {
  url: string;
  title: string;
  source: string;
  type: 'government' | 'academic' | 'industry' | 'news';
  date?: string;
}

export default function Citation({ url, title, source, type, date }: CitationProps) {
  const getIcon = () => {
    switch (type) {
      case 'government':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'academic':
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return <ExternalLink className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'government':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'academic':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'industry':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            {date && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {date}
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {source}
          </p>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View source
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
} 