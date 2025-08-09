'use client';

import React, { useState } from 'react';
import { createOCRService } from '@/lib/ocr';

export default function TestOCR() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processedItems, setProcessedItems] = useState<any[]>([]);

  const testOCR = async () => {
    setLoading(true);
    try {
      const ocrService = createOCRService();
      console.log('OCR Service type:', ocrService.constructor.name);
      
      // Test with a sample image data
      const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      
      const result = await ocrService.extractTextFromImage(testImageData);
      setResult(result);
      console.log('OCR Result:', result);
      
      // Process the texts to menu items
      if (result.success && result.texts.length > 0) {
        const items = processTextsToMenuItems(result.texts);
        setProcessedItems(items);
        console.log('Processed Items:', items);
      }
    } catch (error) {
      console.error('OCR Test Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const processTextsToMenuItems = (texts: any[]): any[] => {
    console.log('🔄 Processing texts:', texts.length);
    
    const items: any[] = [];
    let currentItem: any = {};

    // Sort texts by Y position (top to bottom)
    const sortedTexts = texts.sort((a, b) => a.boundingBox.y - b.boundingBox.y);
    
    console.log('📝 Sorted texts:', sortedTexts.map(t => t.text));

    // Keywords that indicate categories
    const categoryKeywords = {
      'appetizers': ['appetizers', 'starters'],
      'main-courses': ['main courses', 'entrees', 'evening menu', 'sando'],
      'desserts': ['desserts', 'croissant'],
      'beverages': ['beverages', 'drinks']
    };

    // Keywords to exclude from dish names
    const excludeKeywords = [
      'menu', 'restaurant', 'extra', '+', 'types', 'bowl', 'plate', 
      'evening', 'morning', 'ingredients', 'contains', 'allergens',
      '3x', '6x', '12x', '(', ')', '?'
    ];

    let currentCategory = 'main-courses';

    sortedTexts.forEach((text, index) => {
      const textLower = text.text.toLowerCase();
      
      // Check if it's a category header
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => textLower.includes(keyword))) {
          currentCategory = category;
          console.log(`📂 Found category: ${text.text} -> ${category}`);
          break;
        }
      }

      // Check if it's a price
      if (text.text.includes('$') || /\d+\.\d{2}/.test(text.text) || /\d+,\d{2}/.test(text.text)) {
        console.log(`💰 Found price: ${text.text}`);
        if (currentItem.name) {
          const priceText = text.text.replace(/[$,]/g, '');
          currentItem.price = parseFloat(priceText) || 0;
          currentItem.category = currentCategory;
          console.log(`✅ Completed item: ${currentItem.name} - $${currentItem.price} in ${currentCategory}`);
          items.push(currentItem);
          currentItem = {};
        }
      }
      // Check if it's a dish name - SIMPLIFIED LOGIC
      else if (text.text.length > 1 && 
               text.text.length < 50 &&
               !excludeKeywords.some(keyword => textLower.includes(keyword)) &&
               // Check if it looks like a dish name
               (textLower.includes('vegan') ||
                textLower.includes('fish') ||
                textLower.includes('strawberry') ||
                textLower.includes('cinnamon') ||
                textLower.includes('brunost') ||
                textLower.includes('matcha') ||
                textLower.includes('vanilla') ||
                textLower.includes('pistachio') ||
                textLower.includes('peanut') ||
                textLower.includes('tuna') ||
                textLower.includes('beans') ||
                textLower.includes('avocado') ||
                textLower.includes('oyster') ||
                textLower.includes('sando') ||
                textLower.includes('croissant') ||
                textLower.includes('onigiri') ||
                textLower.includes('poke') ||
                // Or starts with capital letter and is reasonable length
                (/^[A-Z][a-zA-Z\s-]+$/.test(text.text) && text.text.length > 2))) {
        console.log(`🍽️ Found dish name: ${text.text}`);
        if (currentItem.name) {
          // Previous item is complete
          if (!currentItem.price) currentItem.price = 0;
          currentItem.category = currentCategory;
          console.log(`✅ Completed previous item: ${currentItem.name}`);
          items.push(currentItem);
        }
        currentItem = {
          id: `item-${index}`,
          name: text.text.replace(':', '').trim(), // Remove colon if present
          description: '',
          price: 0,
          category: currentCategory,
          originalText: text.text
        };
      }
      // Check if it's a description
      else if (text.text.length > 10 && 
               !textLower.includes('$') &&
               !excludeKeywords.some(keyword => textLower.includes(keyword)) &&
               (text.text.includes(',') || text.text.includes('brioche') || text.text.includes('loaf'))) {
        console.log(`📝 Found description: ${text.text}`);
        if (currentItem.name) {
          currentItem.description = text.text;
        }
      }
    });

    // Add last item if incomplete
    if (currentItem.name) {
      if (!currentItem.price) currentItem.price = 0;
      currentItem.category = currentCategory;
      console.log(`✅ Completed final item: ${currentItem.name}`);
      items.push(currentItem);
    }

    console.log('🎯 Final processed items:', items);
    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">OCR Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test OCR Service */}
          <div className="bg-slate-800/80 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test OCR Service</h2>
            
            <button
              onClick={testOCR}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              {loading ? 'Testing...' : 'Test OCR'}
            </button>
            
            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">OCR Result:</h3>
                <div className="bg-slate-700/50 p-4 rounded-lg max-h-64 overflow-auto text-sm">
                  <div className="mb-2">
                    <strong className="text-slate-300">Success:</strong> {result.success ? '✅ Yes' : '❌ No'}
                  </div>
                  <div className="mb-2">
                    <strong className="text-slate-300">Texts Found:</strong> {result.texts?.length || 0}
                  </div>
                  <div className="mb-2">
                    <strong className="text-slate-300">Language:</strong> {result.language || 'Unknown'}
                  </div>
                  {result.error && (
                    <div className="text-red-400">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Processed Menu Items */}
          <div className="bg-slate-800/80 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Processed Menu Items</h2>
            
            {processedItems.length > 0 ? (
              <div className="space-y-4">
                {processedItems.map((item, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4 bg-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                      <span className="text-sm bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-slate-300 text-sm mb-2">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400">ID: {item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-8">
                No processed items yet. Click "Test OCR" to see results.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-800/80 rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Click "Test OCR" to verify OCR service is working</li>
            <li>Check console for detailed logs (F12 → Console)</li>
            <li>If using MockOCRService, create .env.local file with your API key</li>
            <li>Go to Menu Maker to test with real images</li>
            <li>Expected results: Vegan, Fish, Strawberry, Cinnamon x Tiramisu, Brunost, etc.</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 