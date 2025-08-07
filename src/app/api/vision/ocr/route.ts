import { NextRequest, NextResponse } from 'next/server';

interface TextAnnotation {
  description: string;
  boundingPoly: {
    vertices: Array<{ x: number; y: number }>;
  };
}

interface GroupedText {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Google Vision API
    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Use the existing API key from the project
    const apiKey = 'AIzaSyDAFapt1QnmVcoRpdJZMPYwvZpZ7bERLNc';
    
    console.log('🔍 Starting OCR processing with Google Vision API...');
    console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...');

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 100,
                },
              ],
              imageContext: {
                languageHints: ['en', 'sk', 'cs', 'de', 'hu']
              }
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('❌ Google Vision API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process image with Google Vision' },
        { status: 500 }
      );
    }

    const visionData = await visionResponse.json();
    console.log('✅ Google Vision API response received');
    
    // Extract and group text from Vision API response
    const groupedTexts = extractAndGroupTexts(visionData);
    
    console.log(`✅ Extracted ${groupedTexts.length} grouped menu items`);

    return NextResponse.json({
      success: true,
      texts: groupedTexts,
      totalExtracted: groupedTexts.length,
    });

  } catch (error) {
    console.error('❌ OCR processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractAndGroupTexts(visionData: any): string[] {
  const texts: string[] = [];
  
  if (visionData.responses && visionData.responses[0]) {
    const textAnnotations = visionData.responses[0].textAnnotations;
    
    if (textAnnotations && textAnnotations.length > 0) {
      console.log(`📝 Processing ${textAnnotations.length} text annotations`);
      
      // First, try to get the full text
      if (textAnnotations[0] && textAnnotations[0].description) {
        const fullText = textAnnotations[0].description;
        console.log('📄 Full text detected:', fullText.substring(0, 200) + '...');
        
        // Split into lines and process each line
        const lines = fullText.split('\n').filter((line: string) => line.trim().length > 0);
        
        for (const line of lines) {
          const cleanedLine = line.trim();
          
          // Skip headers and navigation
          if (isHeaderOrNavigation(cleanedLine)) {
            continue;
          }
          
          // Check if this looks like a menu item
          if (isMenuItem(cleanedLine)) {
            texts.push(cleanedLine);
          }
        }
      }
      
      // If we don't have enough items from full text, try individual annotations
      if (texts.length < 3) {
        console.log('🔍 Using individual text annotations as fallback');
        
        const groupedItems = groupIndividualTexts(textAnnotations);
        texts.push(...groupedItems);
      }
    }
  }

  // Filter and clean final texts
  return texts
    .filter(text => text.length > 3) // Remove very short texts
    .filter(text => !isHeaderOrNavigation(text)) // Remove headers
    .map(text => text.replace(/\s+/g, ' ').trim()) // Clean whitespace
    .filter((text, index, arr) => arr.indexOf(text) === index); // Remove duplicates
}

function isHeaderOrNavigation(text: string): boolean {
  const headers = [
    'about contrasts', 'all menus', 'food', 'menu', 'restaurant',
    'contact', 'phone', 'email', 'address', 'hours', 'opening',
    'delivery', 'takeaway', 'dine in', 'reservations'
  ];
  
  const lowerText = text.toLowerCase();
  return headers.some(header => lowerText.includes(header));
}

function isMenuItem(text: string): boolean {
  // Check if text contains typical menu item patterns
  const menuPatterns = [
    /\$[\d.,]+/, // Contains price
    /€[\d.,]+/, // Contains Euro price
    /\d+[.,]\d{2}/, // Contains decimal price
    / - /, // Contains description separator
    /, /, // Contains comma separator
    /\(/, // Contains parentheses (ingredients)
    /[A-Z][a-z]+ [A-Z][a-z]+/, // Contains multiple capitalized words
  ];
  
  return menuPatterns.some(pattern => pattern.test(text));
}

function groupIndividualTexts(textAnnotations: TextAnnotation[]): string[] {
  const items: string[] = [];
  
  // Skip the first annotation (contains full text)
  const individualTexts = textAnnotations.slice(1);
  
  // Sort by Y position (top to bottom)
  const sortedTexts = individualTexts.sort((a, b) => {
    const aY = a.boundingPoly.vertices[0]?.y || 0;
    const bY = b.boundingPoly.vertices[0]?.y || 0;
    return aY - bY;
  });
  
  // Group texts that are on the same line (within 20px Y difference)
  const lineThreshold = 20;
  let currentLine: string[] = [];
  let currentY = -1;
  
  for (const annotation of sortedTexts) {
    const text = annotation.description.trim();
    const y = annotation.boundingPoly.vertices[0]?.y || 0;
    
    if (text.length < 1) continue;
    
    // Skip headers
    if (isHeaderOrNavigation(text)) {
      continue;
    }
    
    // Group into lines based on Y position
    if (currentY === -1 || Math.abs(y - currentY) > lineThreshold) {
      // Process previous line
      if (currentLine.length > 0) {
        const lineText = currentLine.join(' ').trim();
        if (lineText && isMenuItem(lineText)) {
          items.push(lineText);
        }
      }
      
      // Start new line
      currentLine = [text];
      currentY = y;
    } else {
      // Add to current line
      currentLine.push(text);
    }
  }
  
  // Process last line
  if (currentLine.length > 0) {
    const lineText = currentLine.join(' ').trim();
    if (lineText && isMenuItem(lineText)) {
      items.push(lineText);
    }
  }
  
  return items;
}
