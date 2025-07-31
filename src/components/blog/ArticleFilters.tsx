'use client';

import { useState } from 'react';
import { useBlogStore } from '@/lib/store';

export default function ArticleFilters() {
  const { selectedCategory, setSelectedCategory } = useBlogStore();
  const [sortBy, setSortBy] = useState('date');

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="all">All Categories</option>
        <option value="menu">Menu Engineering</option>
        <option value="analytics">Analytics</option>
        <option value="tech">Technology</option>
      </select>
      
      <select 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="date">Latest First</option>
        <option value="title">Alphabetical</option>
        <option value="readTime">Reading Time</option>
      </select>
    </div>
  );
} 