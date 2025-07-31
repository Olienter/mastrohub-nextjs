'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Database, FileText, Settings } from 'lucide-react';

export default function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create sample data
      const data = {
        articles: [],
        profiles: [],
        badges: [],
        progress: []
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mastrohub-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      console.log('Export successful');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Simulate import
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Import successful');
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Export and import your data safely
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Download className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export Data
            </h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Download all your data in JSON format for backup or migration.
          </p>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </button>
        </motion.div>

        {/* Import Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Upload className="w-6 h-6 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Import Data
            </h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Import data from a previously exported JSON file.
          </p>
          
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Data Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center mb-4">
          <Database className="w-6 h-6 text-purple-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Comments</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 