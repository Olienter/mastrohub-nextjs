import { NextRequest, NextResponse } from 'next/server';

interface TextAnnotation {
  description: string;
  confidence?: number;
  boundingPoly: {
    vertices: Array<{ x: number; y: number }>;
  };
}

interface ExtractedText {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description_raw: string;
  price: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  menu_id: string;
  sections: MenuSection[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 OCR API called - using Google Vision API with API key');
    
    // Handle multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      console.error('❌ No image file provided');
      return NextResponse.json(
        { error: 'No image file provided', success: false },
        { status: 400 }
      );
    }

    // Check image format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    if (!allowedTypes.includes(imageFile.type)) {
      console.error('❌ Unsupported image format:', imageFile.type);
      return NextResponse.json(
        { error: 'Unsupported image format. Please use JPEG, PNG, GIF, or BMP.', success: false },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    console.log('📊 Image info:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      base64Length: base64Image.length,
      base64Preview: base64Image.substring(0, 100) + '...'
    });

    // Use Google Vision API with API key
    const apiKey = 'AIzaSyDAFapt1QnmVcoRpdJZMPYwvZpZ7bERLNc';
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...');
    console.log('🌐 Calling URL:', visionApiUrl);
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 50
            }
          ]
        }
      ]
    };

    console.log('📤 Calling Google Vision API with API key...');
    
    const response = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Google Vision API error:', errorData);
      return NextResponse.json(
        { error: 'Google Vision API failed', details: errorData, success: false },
        { status: response.status }
      );
    }

    const visionResult = await response.json();
    console.log('✅ Google Vision API response received');
    console.log('🔍 Full Google Vision response:', JSON.stringify(visionResult, null, 2));
    
    // Check if response has errors
    if (visionResult.error) {
      console.error('❌ Google Vision API error:', visionResult.error);
    }
    
    // Check if response has responses array
    if (!visionResult.responses || !Array.isArray(visionResult.responses)) {
      console.error('❌ Invalid response format:', visionResult);
    }

    // Extract text annotations
    const textAnnotations = visionResult.responses[0]?.textAnnotations || [];
    
    console.log('📝 Text annotations found:', textAnnotations.length);
    if (textAnnotations.length > 0) {
      console.log('📝 First few annotations:', textAnnotations.slice(0, 3).map(t => t.description));
    }
    
    if (textAnnotations.length === 0) {
      console.log('❌ No text annotations found in Google Vision response');
      return NextResponse.json({
        success: false,
        error: 'No text detected in image',
        texts: []
      });
    }

    // Process extracted texts
    const extractedTexts: ExtractedText[] = textAnnotations.slice(1).map((annotation: TextAnnotation, index: number) => ({
      text: annotation.description,
      confidence: annotation.confidence || 0.0,
      boundingBox: {
        x: annotation.boundingPoly.vertices[0].x,
        y: annotation.boundingPoly.vertices[0].y,
        width: annotation.boundingPoly.vertices[1].x - annotation.boundingPoly.vertices[0].x,
        height: annotation.boundingPoly.vertices[2].y - annotation.boundingPoly.vertices[0].y
      }
    }));

    // Parse menu items from extracted text
    const menuData = parseMenuText(extractedTexts);

    return NextResponse.json({
      success: true,
      menu_id: menuData.menu_id,
      sections: menuData.sections,
      texts: extractedTexts
    });
    
  } catch (error) {
    console.error('❌ OCR API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}

function parseMenuText(texts: ExtractedText[]): MenuData {
  // Sort texts by Y position (top to bottom)
  const sortedTexts = texts.sort((a, b) => a.boundingBox.y - b.boundingBox.y);
  
  // Group texts into lines
  const lineThreshold = 30;
  const menuLines: string[] = [];
  let currentLine: string[] = [];
  let currentY = -1;
  
  for (const text of sortedTexts) {
    const textContent = text.text.trim();
    
    if (textContent.length < 1) continue;
    
    // Skip headers
    if (textContent.toLowerCase().includes('about contrasts') || 
        textContent.toLowerCase().includes('all menus') || 
        textContent.toLowerCase().includes('food')) {
      continue;
    }
    
    // Group into lines based on Y position
    if (currentY === -1 || Math.abs(text.boundingBox.y - currentY) > lineThreshold) {
      if (currentLine.length > 0) {
        const lineText = currentLine.join(' ').trim();
        if (lineText) menuLines.push(lineText);
      }
      currentLine = [textContent];
      currentY = text.boundingBox.y;
    } else {
      currentLine.push(textContent);
    }
  }
  
  // Add last line
  if (currentLine.length > 0) {
    const lineText = currentLine.join(' ').trim();
    if (lineText) menuLines.push(lineText);
  }
  
  // Parse into sections and items
  const sections: MenuSection[] = [];
  let currentSection: MenuSection = { title: "Main Menu", items: [] };
  
  for (const line of menuLines) {
    if (line.length < 2) continue;
    
    // Check if it's a section header
    if (line.endsWith(':') || line.toLowerCase().includes('menu')) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line.replace(':', '').trim(), items: [] };
    } else {
      // Parse item
      let name = line;
      let description = "";
      let price = 0;
      
      // Extract price
      const priceMatch = line.match(/(\d+[.,]\d{2}|\d+\s*[€$])/);
      if (priceMatch) {
        const priceText = priceMatch[0].replace('€', '').replace('$', '').replace(' ', '');
        try {
          price = parseFloat(priceText.replace(',', '.'));
          name = line.replace(priceMatch[0], '').trim();
        } catch (e) {
          // Ignore price parsing errors
        }
      }
      
      // Extract description
      if (name.includes(' - ') || name.includes(', ')) {
        const parts = name.includes(' - ') ? name.split(' - ') : name.split(', ');
        name = parts[0].trim();
        description = parts[1]?.trim() || "";
      }
      
      currentSection.items.push({
        id: `item-${currentSection.items.length}`,
        name: name.replace(':', '').replace(';', '').trim(),
        description_raw: description,
        price: price
      });
    }
  }
  
  // Add last section
  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }
  
  return {
    menu_id: `menu-${menuLines.length}`,
    sections: sections
  };
}