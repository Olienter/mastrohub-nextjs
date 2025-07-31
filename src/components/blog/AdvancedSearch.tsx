'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, TrendingUp, Filter, X } from 'lucide-react';
import { useBlogStore } from '@/lib/store';

export default function AdvancedSearch() {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    articles
  } = useBlogStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique categories and tags from articles
  const categories = [...new Set(articles.map(article => article.category))];
  const allTags = articles.flatMap(article => article.tags);
  const tags = [...new Set(allTags)];

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, 4));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        // Handle selection
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen]);

  const handleInputFocus = useCallback(() => {
    if (searchQuery.length > 2) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search articles, topics, or authors..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            aria-label="Search articles"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
            aria-autocomplete="list"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg transition-colors ${
            showFilters 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          aria-label="Toggle filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-4 z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 8).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 