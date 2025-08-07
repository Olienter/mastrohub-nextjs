# Google Vision OCR Setup Guide

## 🚀 Quick Start

### 1. Enable Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Vision API**
4. Go to APIs & Services > Credentials

### 2. Create Service Account
1. Click "Create Credentials" > "Service Account"
2. Name: `mastrohub-vision-api`
3. Description: `Service account for MastroHub OCR`
4. Click "Create and Continue"
5. Role: `Cloud Vision API User`
6. Click "Done"

### 3. Generate JSON Key
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file

### 4. Convert to Base64
```bash
# On Windows PowerShell:
$jsonContent = Get-Content "path\to\your\service-account.json" -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($jsonContent))
echo $base64
```

### 5. Set Environment Variable
1. Copy the base64 string
2. Add to your `.env.local` file:
```
GOOGLE_CREDENTIALS_B64=your_base64_string_here
```

## 🔧 Installation

### FastAPI Backend
```bash
cd apps/api
pip install -r requirements.txt
```

### Start FastAPI Server
```bash
cd apps/api
python main.py
```

### Start Next.js Frontend
```bash
npm run dev
```

## 🧪 Testing

1. Go to `http://localhost:3000/menu-maker`
2. Click the Camera icon 📷
3. Upload a menu image
4. Check the parsed results

## 🔒 Security Notes

- Never commit the JSON key file
- Use base64 encoding for environment variables
- The key is automatically decoded in the FastAPI backend
- CORS is configured for localhost development

## 🐛 Troubleshooting

### "Google credentials not configured"
- Check that `GOOGLE_CREDENTIALS_B64` is set in `.env.local`
- Verify the base64 string is correct

### "FastAPI processing failed"
- Ensure FastAPI server is running on port 8000
- Check that the image file is valid

### "No text detected"
- Try a clearer image
- Ensure text is readable in the image
- Check image format (JPG, PNG supported) 