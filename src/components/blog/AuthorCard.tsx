'use client';

import Image from 'next/image';
import { Linkedin, Globe, Award } from 'lucide-react';

interface AuthorCardProps {
  name: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  website?: string;
  expertise: string[];
  factChecked?: boolean;
}

export default function AuthorCard({
  name,
  bio,
  avatar,
  linkedin,
  website,
  expertise,
  factChecked = false
}: AuthorCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Image
            src={avatar}
            alt={name}
            width={64}
            height={64}
            className="rounded-full"
          />
          {factChecked && (
            <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full">
              <Award className="w-3 h-3" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {bio}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {expertise.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {factChecked && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Award className="w-4 h-4" />
            <span>Last fact-checked: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}