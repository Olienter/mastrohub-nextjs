'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X, CheckCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImageImportProps {
  onCancel: () => void;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description_raw: string;
  price?: number;
}

export default function ImageImport({ onCancel }: ImageImportProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setIsProcessing(true);
    
    try {
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to API
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.sections) {
        // Show parsed menu data
        setMenuData(result.sections || []);
      } else {
        throw new Error(result.error || 'Processing failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleImportToMenu = () => {
    // Convert sections to items format for Menu Maker
    const allItems = menuData.flatMap((section) => 
      section.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description_raw || '',
        price: item.price || 0,
        category: 'main-courses',
        originalText: item.name
      }))
    );

    // Pass to parent component
    onCancel(); // Close modal
    // You can add a callback here to pass data to Menu Maker
    console.log('Imported items:', allItems);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Import Menu from Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isUploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {!uploadedImage ? (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your menu image here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to select a file
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Select Image
              </label>
            </div>
          ) : (
            <div>
              <img
                src={uploadedImage}
                alt="Uploaded menu"
                className="max-h-64 mx-auto rounded-lg"
              />
              {isProcessing && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Processing menu...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Parsed Menu Data */}
        {menuData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Parsed Menu Items</h3>
            <div className="space-y-4">
              {menuData.map((section, sectionIndex) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description_raw && (
                            <p className="text-sm text-gray-600">{item.description_raw}</p>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-green-600 font-medium">${item.price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          {menuData.length > 0 && (
            <button
              onClick={handleImportToMenu}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Import to Menu Builder
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
} 