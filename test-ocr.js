const fs = require('fs');
const path = require('path');

// Test Google Vision API directly
async function testGoogleVisionAPI() {
  console.log('🧪 Testing Google Vision API...');
  
  // Sample base64 image (1x1 pixel PNG)
  const sampleImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const apiKey = 'AIzaSyDAFapt1QnmVcoRpdJZMPYwvZpZ7bERLNc';
  const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
  const requestBody = {
    requests: [
      {
        image: {
          content: sampleImage
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

  try {
    console.log('📤 Calling Google Vision API...');
    
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
      return;
    }

    const result = await response.json();
    console.log('✅ Google Vision API response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing Google Vision API:', error);
  }
}

testGoogleVisionAPI();
