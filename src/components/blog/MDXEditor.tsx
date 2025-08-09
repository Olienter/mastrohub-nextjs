"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  EyeOff, 
  FileText, 
  Image, 
  Link, 
  Bold, 
  Italic,
  List,
  Quote,
  Code,
  Undo,
  Redo
} from 'lucide-react';
import { z } from 'zod';

// Front matter validation schema
const FrontMatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Valid image URL is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'published']).default('draft'),
});

interface MDXEditorProps {
  initialContent?: string;
  initialFrontMatter?: any;
  onSave?: (content: string, frontMatter: any) => Promise<void>;
  onPublish?: (content: string, frontMatter: any) => Promise<void>;
}

export default function MDXEditor({ 
  initialContent = '', 
  initialFrontMatter = {},
  onSave,
  onPublish 
}: MDXEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [frontMatter, setFrontMatter] = useState(initialFrontMatter);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Validate front matter
  const validateFrontMatter = () => {
    try {
      FrontMatterSchema.parse(frontMatter);
      setErrors([]);
      return true;
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors.map((err: any) => err.message));
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateFrontMatter()) return;
    
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(content, frontMatter);
      }
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateFrontMatter()) return;
    
    setIsSaving(true);
    try {
      if (onPublish) {
        await onPublish(content, { ...frontMatter, status: 'published' });
      }
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsSaving(false);
    }
  };

  const updateFrontMatter = (key: string, value: any) => {
    setFrontMatter((prev: any) => ({ ...prev, [key]: value }));
  };

  const addTag = (tag: string) => {
    if (tag && !frontMatter.tags?.includes(tag)) {
      updateFrontMatter('tags', [...(frontMatter.tags || []), tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFrontMatter('tags', frontMatter.tags?.filter((tag: string) => tag !== tagToRemove) || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              MDX Editor
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FileText size={16} />
                <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Validation Errors:</h3>
                <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {isPreview ? (
              <div className="bg-slate-800/80 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {frontMatter.title || 'Untitled Article'}
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-slate-300">
                    {content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/80 rounded-lg shadow-lg">
                <div className="border-b border-slate-700 p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <Bold size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <Italic size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <List size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <Quote size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <Code size={16} />
                    </button>
                    <div className="flex-1" />
                    <span className="text-sm text-slate-400">
                      {wordCount} words
                    </span>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border-0 focus:ring-0 resize-none bg-transparent text-white"
                  placeholder="Start writing your article..."
                />
              </div>
            )}
          </div>

          {/* Front Matter Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800/80 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Article Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={frontMatter.title || ''}
                    onChange={(e) => updateFrontMatter('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                    placeholder="Article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={frontMatter.excerpt || ''}
                    onChange={(e) => updateFrontMatter('excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                    placeholder="Brief description of the article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={frontMatter.category || ''}
                    onChange={(e) => updateFrontMatter('category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Menu Engineering">Menu Engineering</option>
                    <option value="Cost Management">Cost Management</option>
                    <option value="Technology">Technology</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Staff Management">Staff Management</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    value={frontMatter.image || ''}
                    onChange={(e) => updateFrontMatter('image', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tags *
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {frontMatter.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={frontMatter.featured || false}
                      onChange={(e) => updateFrontMatter('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured Article
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={frontMatter.status || 'draft'}
                    onChange={(e) => updateFrontMatter('status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* End of Editor */}
      </div>
    </div>
  );
}
  