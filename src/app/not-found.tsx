'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-full">
            <Search className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to homepage
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </motion.button>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Error code: 404</p>
        </div>
      </motion.div>
    </div>
  );
} 