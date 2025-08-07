'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X, CheckCircle, Edit, Trash2, Plus, Save } from 'lucide-react';

interface ImageUploadProps {
  onImageProcessed: (menuData: MenuData) => void;
  onCancel: () => void;
}

interface MenuData {
  restaurant: string;
  items: Array<{
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
}

interface ExtractedText {
  id: string;
  text: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

interface ProcessedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  originalText: string;
}

export default function ImageUpload({ onImageProcessed, onCancel }: ImageUploadProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcessedItem | null>(null);

  // Reset preview when image is cleared
  useEffect(() => {
    if (!image) {
      setPreview('');
      setExtractedTexts([]);
      setProcessedItems([]);
    }
  }, [image]);

  const handleImageUpload = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreview(result);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        setImage(null);
        setPreview('');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const extractTextFromImage = async () => {
    if (!image) return;

    // Check image size and quality
    if (image.size > 10 * 1024 * 1024) { // 10MB limit
      alert('❌ Image is too large. Please use an image smaller than 10MB.');
      return;
    }

    // Reset state for new processing
    setProcessedItems([]);
    setExtractedTexts([]);
    setShowTextEditor(false);
    setEditingItem(null);
    
    setProcessing(true);
    setProgress(0);

    try {
      setProgress(20);

      // Call OCR API with multipart form data
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      setProgress(60);

      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`);
      }

      const result = await response.json();
      setProgress(80);

      console.log('🔍 OCR API Response:', result);

      if (!result.success) {
        const errorMessage = result.error || 'OCR processing failed';
        console.error('OCR Error:', errorMessage);
        
        // Show user-friendly error message
        if (errorMessage.includes('No text detected')) {
          alert('❌ No text was detected in the image.\n\nPlease try:\n• A clearer, higher quality image\n• Better lighting\n• Ensure text is clearly visible\n• Try a different angle');
        } else {
          alert(`❌ OCR Error: ${errorMessage}\n\nPlease try again with a different image.`);
        }
        return;
      }

      // Use FastAPI parsed menu data directly
      if (result.sections && result.sections.length > 0) {
        const menuItems = result.sections.flatMap((section: { items: Array<{ id: string; name: string; description_raw?: string; price?: number }> }, sectionIndex: number) => 
          section.items.map((item, itemIndex) => ({
            id: `api-${Date.now()}-${sectionIndex}-${itemIndex}`,
            name: item.name,
            description: item.description_raw || '',
            price: item.price || 0,
            category: 'main-courses',
            originalText: item.name
          }))
        );
        
        setProcessedItems(menuItems);
        // Ensure unique IDs for extracted texts
        const uniqueTexts = (result.texts || []).map((text: any, index: number) => ({
          ...text,
          id: `api-text-${Date.now()}-${index}`
        }));
        setExtractedTexts(uniqueTexts);
      } else {
        // Fallback to old processing if no sections
        const extractedTexts: ExtractedText[] = result.texts.map((text: { text: string; confidence: number; boundingBox: { x: number; y: number; width: number; height: number } }, index: number) => ({
          id: `ocr-${Date.now()}-${index}`,
          text: text.text,
          confidence: text.confidence,
          boundingBox: text.boundingBox,
        }));
        
        setExtractedTexts(extractedTexts);
        const autoProcessedItems = processTextsToMenuItems(extractedTexts);
        setProcessedItems(autoProcessedItems);
      }
      
      setProgress(100);
      setShowTextEditor(true);
      
    } catch (error) {
      console.error('Error processing image:', error);
      // Show error message to user
      alert('Error processing image. Please try again with a clearer image.');
    } finally {
      setProcessing(false);
    }
  };

  const processTextsToMenuItems = (texts: ExtractedText[]): ProcessedItem[] => {
    console.log('🔄 Processing texts:', texts.length);
    console.log('📝 All texts:', texts.map(t => t.text));
    
    if (texts.length === 0) {
      console.warn('⚠️ No texts to process');
      return [];
    }
    
    const items: ProcessedItem[] = [];
    let currentItem: Partial<ProcessedItem> = {};

    // Sort texts by Y position (top to bottom)
    const sortedTexts = texts.sort((a, b) => a.boundingBox.y - b.boundingBox.y);
    
    console.log('📝 Sorted texts:', sortedTexts.map(t => t.text));

    // Enhanced category patterns for better detection
    const categoryPatterns: Record<string, RegExp[]> = {
      'main-courses': [
        /sando\s*-\s*savory/i,
        /sando\s*-\s*salty/i,
        /sando\s*-\s*sweet/i,
        /evening\s*menu/i,
        /main\s*courses/i,
        /entrees/i,
        /food/i,
        /dishes/i
      ],
      'desserts': [
        /croissant\s*rolls/i,
        /desserts/i,
        /sweet\s*section/i,
        /pastries/i,
        /cakes/i
      ],
      'appetizers': [
        /appetizers/i,
        /starters/i,
        /small\s*plates/i,
        /snacks/i
      ],
      'beverages': [
        /beverages/i,
        /drinks/i,
        /beverage/i,
        /coffee/i,
        /tea/i
      ]
    };

    // Enhanced dish name patterns for better recognition
    const dishNamePatterns = [
      /^[A-Z][a-zA-Z\s-]+$/, // Starts with capital, reasonable length
      /^[A-Z][a-zA-Z\s-]+x\s+[A-Z][a-zA-Z\s-]+$/, // Pattern like "Cinnamon x Tiramisu"
      /^[A-Z][a-zA-Z\s-]+\s*\([^)]+\)$/, // Pattern like "Onigiri (3 types)"
      /^[A-Z][a-zA-Z\s-]+\s*\/\s*[A-Z][a-zA-Z\s-]+$/, // Pattern like "Tartar / Tataki"
      /^[A-Z][a-zA-Z\s-]+\s+[A-Z][a-zA-Z\s-]+$/, // Two word dish names
      /^[A-Z][a-zA-Z\s-]+\s+slider$/i, // Slider dishes
      /^[A-Z][a-zA-Z\s-]+\s+balls$/i, // Balls dishes
      /^[A-Z][a-zA-Z\s-]+\s+soup$/i, // Soup dishes
      /^[A-Z][a-zA-Z\s-]+\s+cheesecake$/i, // Cheesecake dishes
    ];

    // Specific dish keywords for better recognition
    const dishKeywords = [
      'pastrami', 'spicy tuna', 'crispy chicken', 'avocado egg', 'vegan', 'fish',
      'strawberry', 'cinnamon', 'brunost', 'matcha', 'vanilla', 'pistachio', 
      'peanut', 'tuna', 'oyster', 'onigiri', 'poke', 'tartar', 'tataki',
      'dumplings', 'beef', 'salmon', 'mushroom', 'slider', 'falafel', 'corn',
      'potato', 'wonton', 'cheesecake', 'mac', 'cheese', 'ribs'
    ];

    // Keywords to exclude with better filtering
    const excludeKeywords = [
      'menu', 'restaurant', 'extra', '+', 'types', 'bowl', 'plate', 
      'evening', 'morning', 'ingredients', 'contains', 'allergens',
      '3x', '6x', '12x', '(', ')', '?', 'brioche', 'loaf', 'salad',
      'sauce', 'butter', 'cream', 'caramel', 'chocolate', 'fruit',
      'about', 'contrasts', 'all menus', 'food'
    ];

    let currentCategory = 'main-courses';

    sortedTexts.forEach((text, index) => {
      const textLower = text.text.toLowerCase();
      const textTrimmed = text.text.trim();
      
      // Skip empty or very short texts
      if (textTrimmed.length < 2) {
        console.log(`⏭️ Skipping short text: "${textTrimmed}"`);
        return;
      }
      
      // Check if it's a category header
      for (const [category, patterns] of Object.entries(categoryPatterns)) {
        if (patterns.some(pattern => pattern.test(textTrimmed))) {
          currentCategory = category;
          console.log(`📂 Found category: "${textTrimmed}" -> ${category}`);
          break;
        }
      }

      // Check if it's a price (enhanced price detection)
      if (textTrimmed.includes('$') || 
          /\d+\.\d{2}/.test(textTrimmed) || 
          /\d+,\d{2}/.test(textTrimmed) ||
          /\d+\s*€/.test(textTrimmed) ||
          /\d+\s*czk/i.test(textTrimmed)) {
        console.log(`💰 Found price: "${textTrimmed}"`);
        if (currentItem.name) {
          const priceText = textTrimmed.replace(/[$,€\s]/g, '');
          currentItem.price = parseFloat(priceText) || 0;
          currentItem.category = currentCategory;
          console.log(`✅ Completed item: ${currentItem.name} - $${currentItem.price} in ${currentCategory}`);
          items.push(currentItem as ProcessedItem);
          currentItem = {};
        }
      }
      // Enhanced dish name detection - ONE LINE = ONE DISH
      else if (textTrimmed.length > 1 && 
               textTrimmed.length < 100 && // Increased length for longer dish names
               !excludeKeywords.some(keyword => textLower.includes(keyword)) &&
               (dishNamePatterns.some(pattern => pattern.test(textTrimmed)) ||
                // Check for specific dish keywords
                dishKeywords.some(keyword => textLower.includes(keyword)) ||
                // Generic pattern for capitalized dish names (more flexible)
                (/^[A-Z][a-zA-Z\s-]+$/.test(textTrimmed) && textTrimmed.length > 2) ||
                // Pattern for dishes with descriptions on same line
                (/^[A-Z][a-zA-Z\s-]+.*[a-z]/.test(textTrimmed) && textTrimmed.length > 5))) {
        
        console.log(`🍽️ Found dish name: "${textTrimmed}"`);
        
        // Complete previous item if exists
        if (currentItem.name) {
          if (!currentItem.price) currentItem.price = 0;
          currentItem.category = currentCategory;
          console.log(`✅ Completed previous item: ${currentItem.name}`);
          items.push(currentItem as ProcessedItem);
        }
        
        // Extract dish name and description from the same line
        let dishName = textTrimmed;
        let description = '';
        
        // If line contains description (separated by dash or comma)
        if (textTrimmed.includes(' - ') || textTrimmed.includes(', ')) {
          const parts = textTrimmed.split(/ - |, /);
          dishName = parts[0].trim();
          description = parts.slice(1).join(', ').trim();
        }
        
        // Start new item
        currentItem = {
          id: `item-${Date.now()}-${index}`,
          name: dishName.replace(/[:;]/g, '').trim(), // Remove colons/semicolons
          description: description,
          price: 0,
          category: currentCategory,
          originalText: textTrimmed
        };
      }
      // Check if it's a description (for multi-line descriptions)
      else if (textTrimmed.length > 10 && 
               !textLower.includes('$') &&
               !excludeKeywords.some(keyword => textLower.includes(keyword)) &&
               (textTrimmed.includes(',') || 
                textTrimmed.includes('brioche') || 
                textTrimmed.includes('loaf') ||
                textTrimmed.includes('sauce') ||
                textTrimmed.includes('cream') ||
                textTrimmed.includes('mayo') ||
                textTrimmed.includes('kimchi') ||
                textTrimmed.includes('pickles') ||
                textTrimmed.includes('truffle') ||
                textTrimmed.includes('caviar'))) {
        console.log(`📝 Found description: "${textTrimmed}"`);
        if (currentItem.name) {
          currentItem.description = textTrimmed;
        }
      }
      // Log skipped texts for debugging
      else {
        console.log(`⏭️ Skipping text: "${textTrimmed}" (doesn't match any pattern)`);
      }
    });

    // Add last item if incomplete
    if (currentItem.name) {
      if (!currentItem.price) currentItem.price = 0;
      currentItem.category = currentCategory;
      console.log(`✅ Completed final item: ${currentItem.name}`);
      items.push(currentItem as ProcessedItem);
    }

    console.log(`🎯 Final processed items: ${items.length}`);
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.category}) - $${item.price}`);
      if (item.description) {
        console.log(`     Description: ${item.description}`);
      }
    });
    
    return items;
  };

  const addNewItem = () => {
    const newItem: ProcessedItem = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      description: '',
      price: 0,
      category: 'main-courses',
      originalText: ''
    };
    setProcessedItems([...processedItems, newItem]);
    setEditingItem(newItem);
  };

  const editItem = (item: ProcessedItem) => {
    setEditingItem(item);
  };

  const deleteItem = (itemId: string) => {
    setProcessedItems(processedItems.filter(item => item.id !== itemId));
  };

  const saveItem = (updatedItem: ProcessedItem) => {
    setProcessedItems(processedItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const confirmProcessedItems = () => {
    const menuData: MenuData = {
      restaurant: "Extracted Menu",
      items: processedItems.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      }))
    };
    
    console.log('🚀 Adding items to menu maker:', menuData);
    onImageProcessed(menuData);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Menu Photo</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!image ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Menu Photo
            </h3>
            <p className="text-gray-600 mb-6">
              Take a photo or upload an image of your menu to automatically extract dishes
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">📸 Tips for best results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting and clear text</li>
                <li>• Hold camera steady and avoid blur</li>
                <li>• Include full menu items with prices</li>
                <li>• Use high resolution images</li>
                <li>• Avoid shadows and reflections</li>
              </ul>
            </div>
            
            <div className="flex gap-4 justify-center">
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              
              <label className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : !showTextEditor ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                {preview && (
                  <img
                    src={preview}
                    alt="Menu preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Extracted Text</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {extractedTexts.map((text, index) => (
                    <div key={`text-${index}-${text.id}`} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{text.text}</span>
                        <span className="text-xs text-gray-500">
                          {Math.round(text.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {processing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-700">Processing image with OCR...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Extracting text from menu image using AI...
                </p>
              </div>
            ) : extractedTexts.length > 0 ? (
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTextEditor(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Menu Items
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={extractTextFromImage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Extract Text
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Menu Items</h3>
              <button
                onClick={addNewItem}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {processedItems.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name || 'Unnamed Item'}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editItem(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmProcessedItems}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add to Menu
              </button>
              <button
                onClick={() => setShowTextEditor(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Menu Item</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="appetizers">Appetizers</option>
                      <option value="main-courses">Main Courses</option>
                      <option value="desserts">Desserts</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => saveItem(editingItem)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 