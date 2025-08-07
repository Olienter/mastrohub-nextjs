# Google Vision API Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **Cloud Vision API**

### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name: `mastrohub-vision`
4. Role: `Cloud Vision API User`
5. Click "Done"

### Step 3: Generate JSON Key
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the file

### Step 4: Convert to Base64
```powershell
# In PowerShell:
$jsonContent = Get-Content "path\to\your\service-account.json" -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($jsonContent))
echo $base64
```

### Step 5: Update .env.local
Replace `your_base64_encoded_service_account_key_here` with your actual base64 string:

```env
GOOGLE_CREDENTIALS_B64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJva...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Test Without Google Credentials
The system works with mock data for testing:
- Upload any image
- Get mock menu items: Burger, Pizza, Salad
- Test the full workflow

## 🔧 Restart Servers
After updating .env.local:
```bash
# Terminal 1: FastAPI
cd apps/api
python main.py

# Terminal 2: Next.js  
npm run dev
```

## 🎯 Test URL
http://localhost:3000/menu-maker 