// src/lib/ocr.ts

export interface OCRText {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OCRResult {
  texts: OCRText[];
  language: string;
  success: boolean;
  error?: string;
}

export class OCRService {
  private apiKey: string;
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async extractTextFromImage(imageData: string): Promise<OCRResult> {
    try {
      console.log('🔍 Starting OCR processing...');
      
      // Remove data URL prefix
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      if (!base64Image) {
        throw new Error('Invalid image data format');
      }

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 100 // Increased for better coverage
              }
            ],
            imageContext: {
              languageHints: ['en', 'sk', 'cs', 'de', 'hu']
            }
          }
        ]
      };

      console.log('📡 Sending request to Google Vision API...');
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Google Vision API Error:', response.status, errorText);
        throw new Error(`OCR API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Google Vision API response received');
      
      if (!data.responses || !data.responses[0]) {
        console.warn('⚠️ No text detected in image');
        return {
          texts: [],
          language: 'unknown',
          success: false,
          error: 'No text detected'
        };
      }

      const result = data.responses[0];
      const texts: OCRText[] = [];

      console.log('📝 Processing text annotations...');

      // Process text annotations with proper handling
      if (result.textAnnotations && result.textAnnotations.length > 0) {
        // First, try to process individual words/phrases
        if (result.textAnnotations.length > 1) {
          console.log(`🔤 Processing ${result.textAnnotations.length - 1} individual text elements`);
          
          // Skip index 0 (contains full text), process individual elements
          for (let i = 1; i < result.textAnnotations.length; i++) {
            const annotation = result.textAnnotations[i];
            const vertices = annotation.boundingPoly?.vertices;
            
            if (vertices && vertices.length >= 4) {
              const x = Math.min(...vertices.map((v: any) => v.x));
              const y = Math.min(...vertices.map((v: any) => v.y));
              const width = Math.max(...vertices.map((v: any) => v.x)) - x;
              const height = Math.max(...vertices.map((v: any) => v.y)) - y;

              texts.push({
                text: annotation.description,
                confidence: 0.95, // Google Vision doesn't provide confidence scores
                boundingBox: { x, y, width, height }
              });
            }
          }
        }

        // If no individual words found or too few, process the full text
        if (texts.length < 3 && result.textAnnotations[0]) {
          console.log('📄 Processing full text as fallback');
          const fullText = result.textAnnotations[0].description;
          const lines = fullText.split('\n').filter((line: string) => line.trim().length > 0);
          
          lines.forEach((line: string, index: number) => {
            texts.push({
              text: line.trim(),
              confidence: 0.90,
              boundingBox: { 
                x: 30, 
                y: 60 + (index * 30), 
                width: 500, 
                height: 25 
              }
            });
          });
        }
      }

      console.log(`✅ Processed ${texts.length} text elements`);
      
      return {
        texts,
        language: result.textAnnotations?.[0]?.locale || 'unknown',
        success: true
      };

    } catch (error) {
      console.error('❌ OCR Error:', error);
      return {
        texts: [],
        language: 'unknown',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Factory function to create OCR service
export function createOCRService(): OCRService | MockOCRService {
  // Use the provided API key directly
  const apiKey = 'AIzaSyDAFapt1QnmVcoRpdJZMPYwvZpZ7bERLNc';
  
  // Debug logging
  console.log('🔍 Checking API key...');
  console.log('API Key available:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.warn('⚠️ No API key available, using mock data');
    return new MockOCRService();
  }
  
  console.log('✅ Using real Google Cloud Vision API');
  return new OCRService(apiKey);
}

// Mock OCR service for testing without API key
class MockOCRService {
  async extractTextFromImage(imageData: string): Promise<OCRResult> {
    console.log('🤖 MockOCRService: Processing image...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate realistic mock data based on image characteristics
    const mockTexts = this.generateRealisticMockTexts(imageData);
    
    console.log(`🤖 MockOCRService: Generated ${mockTexts.length} mock texts`);
    
    return {
      texts: mockTexts,
      language: 'en',
      success: true
    };
  }

  private generateRealisticMockTexts(imageData: string): OCRText[] {
    // Analyze image data to determine menu type
    const imageSize = imageData.length;
    const isLargeImage = imageSize > 100000;
    
    console.log(`🤖 MockOCRService: Image size ${imageSize}, large: ${isLargeImage}`);
    
    // Realistic menu structure based on user's menu
    const menuItems = [
      // Header
      { text: 'About Contrasts', confidence: 0.98, boundingBox: { x: 20, y: 20, width: 200, height: 30 } },
      { text: 'All Menus', confidence: 0.98, boundingBox: { x: 400, y: 20, width: 150, height: 30 } },
      
      // Main section
      { text: 'FOOD', confidence: 0.99, boundingBox: { x: 20, y: 60, width: 100, height: 35 } },
      
      // Sando - salty section
      { text: 'Sando - salty:', confidence: 0.95, boundingBox: { x: 20, y: 100, width: 200, height: 25 } },
      { text: 'Pastrami - brioche loaf, pastrami, cabbage, pickles', confidence: 0.94, boundingBox: { x: 30, y: 130, width: 450, height: 25 } },
      { text: 'Spicy Tuna - brioche loaf, tuna, egg, chilli sauce', confidence: 0.93, boundingBox: { x: 30, y: 160, width: 450, height: 25 } },
      { text: 'Crispy Chicken - brioche loaf, chicken katsu, black garlic mayo, cabbage', confidence: 0.92, boundingBox: { x: 30, y: 190, width: 500, height: 25 } },
      { text: 'Avocado Egg - brioche loaf, egg, avocado, kimchi', confidence: 0.94, boundingBox: { x: 30, y: 220, width: 400, height: 25 } },
      { text: 'Vegan - brioche loaf, pulled oyster mushrooms, miso vegan butter, caramelised onion', confidence: 0.91, boundingBox: { x: 30, y: 250, width: 520, height: 25 } },
      { text: 'Fish - brioche loaf, fried cod fish, cilantro, pickles, tartar sauce', confidence: 0.93, boundingBox: { x: 30, y: 280, width: 480, height: 25 } },
      { text: 'EXTRA: + egg + bacon', confidence: 0.90, boundingBox: { x: 30, y: 310, width: 250, height: 20 } },
      
      // Sando - sweet section
      { text: 'Sando - sweet:', confidence: 0.95, boundingBox: { x: 20, y: 350, width: 200, height: 25 } },
      { text: 'Strawberry - brioche loaf, vanilla, strawberry, tonka', confidence: 0.92, boundingBox: { x: 30, y: 380, width: 420, height: 25 } },
      { text: 'Cinnamon x Tiramisu - brioche loaf, cinnamon, coffee, miso cream', confidence: 0.93, boundingBox: { x: 30, y: 410, width: 450, height: 25 } },
      { text: 'Brunost - brioche loaf, brunost, salted caramel, blueberry', confidence: 0.94, boundingBox: { x: 30, y: 440, width: 420, height: 25 } },
    ];

    // Add more items for large images
    if (isLargeImage) {
      menuItems.push(
        { text: 'Croissant rolls:', confidence: 0.95, boundingBox: { x: 20, y: 480, width: 200, height: 25 } },
        { text: 'Matcha, white chocolate, passion fruit', confidence: 0.94, boundingBox: { x: 30, y: 510, width: 350, height: 25 } },
        { text: 'Vanilla, Cinnamon, strawberry', confidence: 0.89, boundingBox: { x: 30, y: 540, width: 320, height: 25 } },
        { text: 'Pistachio, apple, salted caramel', confidence: 0.92, boundingBox: { x: 30, y: 570, width: 350, height: 25 } },
        { text: 'Peanut butter, chocolate, banana', confidence: 0.91, boundingBox: { x: 30, y: 600, width: 380, height: 25 } },
        { text: 'Onigiri: ? (3 types) - tuna, vegan, beans avocado', confidence: 0.95, boundingBox: { x: 20, y: 630, width: 350, height: 25 } },
        { text: '+ Poke salad bowl', confidence: 0.88, boundingBox: { x: 30, y: 660, width: 250, height: 20 } },
        { text: 'Evening menu:', confidence: 0.95, boundingBox: { x: 20, y: 690, width: 200, height: 25 } },
        { text: 'Oyster plate - 3x, 6x, 12x', confidence: 0.93, boundingBox: { x: 30, y: 720, width: 300, height: 25 } },
        { text: 'Tartar / Tataki selection - beef, salmon, mushroom (garlic, brioche)', confidence: 0.92, boundingBox: { x: 30, y: 750, width: 480, height: 25 } },
        { text: 'Crispy dumplings - chicken, shrimp, veggie', confidence: 0.91, boundingBox: { x: 30, y: 780, width: 380, height: 25 } },
        { text: 'Juicy Beef Slider / Pastrami slider, parmesan fries', confidence: 0.90, boundingBox: { x: 30, y: 810, width: 420, height: 25 } },
        { text: 'Mac & Cheese, truffle, micro greens', confidence: 0.89, boundingBox: { x: 30, y: 840, width: 350, height: 25 } },
        { text: 'Falafel balls with dressings', confidence: 0.88, boundingBox: { x: 30, y: 870, width: 320, height: 25 } },
        { text: 'Marinated corn ribs', confidence: 0.87, boundingBox: { x: 30, y: 900, width: 280, height: 25 } },
        { text: 'Puff potato, truffle, caviar', confidence: 0.86, boundingBox: { x: 30, y: 930, width: 300, height: 25 } },
        { text: 'Wonton soup', confidence: 0.85, boundingBox: { x: 30, y: 960, width: 200, height: 25 } },
        { text: 'Matcha cheesecake', confidence: 0.84, boundingBox: { x: 30, y: 990, width: 250, height: 25 } }
      );
    }

    return menuItems;
  }
}