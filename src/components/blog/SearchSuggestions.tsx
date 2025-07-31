'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';
import { useBlogStore } from '@/lib/store';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'article' | 'trending' | 'recent';
  url: string;
}

export default function SearchSuggestions() {
  const { searchQuery, setSearchQuery } = useBlogStore();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Menu Engineering Strategies', type: 'trending', url: '/blog/menu-engineering' },
    { id: '2', title: 'Restaurant Analytics Guide', type: 'article', url: '/blog/analytics-guide' },
    { id: '3', title: 'Food Cost Management', type: 'recent', url: '/blog/cost-management' },
    { id: '4', title: 'AI in Restaurant Technology', type: 'trending', url: '/blog/ai-technology' },
    { id: '5', title: 'Staff Training Programs', type: 'article', url: '/blog/staff-training' },
  ];

  const getIcon = useCallback((type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filtered);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearch(searchQuery);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchQuery, handleSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, selectedIndex, suggestions]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setIsOpen(false);
    
    // Track search interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search_suggestion_click', {
        event_category: 'search',
        event_label: suggestion.title,
        value: 1
      });
    }
    
    // Navigate to suggestion
    window.location.href = suggestion.url;
  }, [setSearchQuery]);

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
      <div className="relative">
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

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : (
            <ul role="listbox" aria-label="Search suggestions">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id} role="option" aria-selected={index === selectedIndex}>
                  <button
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {getIcon(suggestion.type)}
                    <span className="text-gray-900 dark:text-white">{suggestion.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 