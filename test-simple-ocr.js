// Test Google Vision API with a simple image
const https = require('https');

async function testGoogleVision() {
  console.log('🧪 Testing Google Vision API...');
  
  // Simple 1x1 pixel PNG (base64)
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

  const postData = JSON.stringify(requestBody);
  
  const options = {
    hostname: 'vision.googleapis.com',
    port: 443,
    path: `/v1/images:annotate?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log('📡 Response status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Full response:', data);
      try {
        const result = JSON.parse(data);
        console.log('📝 Parsed response:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.error('❌ Error parsing response:', e);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e);
  });

  req.write(postData);
  req.end();
}

testGoogleVision();
