const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>MastroHub OCR Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; }
            .result { margin-top: 20px; padding: 10px; background: #f0f0f0; }
        </style>
    </head>
    <body>
        <h1>MastroHub OCR Test</h1>
        <div class="upload-area">
            <h3>Upload Menu Image</h3>
            <form id="uploadForm">
                <input type="file" id="imageInput" accept="image/*" required>
                <button type="submit">Extract Text</button>
            </form>
        </div>
        <div id="result" class="result" style="display: none;"></div>
        
        <script>
            document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const fileInput = document.getElementById('imageInput');
                const file = fileInput.files[0];
                
                if (!file) {
                    alert('Please select an image file');
                    return;
                }
                
                const formData = new FormData();
                formData.append('image', file);
                
                try {
                    const response = await fetch('/api/ocr', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    const resultDiv = document.getElementById('result');
                    resultDiv.style.display = 'block';
                    
                    if (result.success) {
                        resultDiv.innerHTML = '<h3>Extracted Text:</h3><pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    } else {
                        resultDiv.innerHTML = '<h3>Error:</h3><pre>' + result.error + '</pre>';
                    }
                } catch (error) {
                    document.getElementById('result').innerHTML = '<h3>Error:</h3><pre>' + error.message + '</pre>';
                }
            });
        </script>
    </body>
    </html>
  `);
});

// OCR API route
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 OCR API called');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided', success: false });
    }

    // For now, return mock data to test the flow
    const mockResult = {
      success: true,
      menu_id: "test-menu-001",
      sections: [
        {
          title: "Main Menu",
          items: [
            {
              id: "item-1",
              name: "Burger",
              description_raw: "Classic beef burger with fries",
              price: 12.99
            },
            {
              id: "item-2",
              name: "Pizza",
              description_raw: "Margherita pizza with fresh basil",
              price: 15.50
            },
            {
              id: "item-3",
              name: "Salad",
              description_raw: "Fresh garden salad with vinaigrette",
              price: 8.99
            }
          ]
        }
      ],
      texts: [
        {
          text: "Burger",
          confidence: 0.95,
          boundingBox: { x: 10, y: 10, width: 100, height: 30 }
        },
        {
          text: "Pizza",
          confidence: 0.92,
          boundingBox: { x: 10, y: 50, width: 100, height: 30 }
        },
        {
          text: "Salad",
          confidence: 0.88,
          boundingBox: { x: 10, y: 90, width: 100, height: 30 }
        }
      ]
    };

    console.log('✅ Returning mock OCR data');
    res.json(mockResult);
    
  } catch (error) {
    console.error('❌ OCR API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      success: false
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 MastroHub OCR Test Server running on http://localhost:${port}`);
  console.log(`📸 Upload images to test OCR functionality`);
}); 