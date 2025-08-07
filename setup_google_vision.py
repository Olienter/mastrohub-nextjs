#!/usr/bin/env python3
"""
Google Vision API Setup Script for MastroHub
This script helps you set up Google Vision API credentials for OCR functionality.
"""

import os
import base64
import json
import sys

def main():
    print("🔧 Google Vision API Setup for MastroHub")
    print("=" * 50)
    
    # Check if .env.local exists
    env_file = ".env.local"
    if not os.path.exists(env_file):
        print(f"❌ {env_file} not found. Creating it...")
        create_env_file(env_file)
    
    # Check current credentials
    current_credentials = get_current_credentials()
    if current_credentials and current_credentials != "your_base64_encoded_service_account_key_here":
        print("✅ Google Vision API credentials are already configured!")
        print("Current credentials length:", len(current_credentials))
        return
    
    print("\n📋 To enable real OCR, you need to:")
    print("1. Go to Google Cloud Console: https://console.cloud.google.com")
    print("2. Create a new project or select existing one")
    print("3. Enable Vision API: https://console.cloud.google.com/apis/library/vision.googleapis.com")
    print("4. Create Service Account: https://console.cloud.google.com/iam-admin/serviceaccounts")
    print("5. Download JSON key file")
    print("6. Run this script with the JSON file path")
    
    # Ask for JSON file path
    json_file = input("\n📁 Enter path to your Google Service Account JSON file: ").strip()
    
    if not json_file or not os.path.exists(json_file):
        print("❌ File not found. Please provide a valid path to your JSON key file.")
        return
    
    # Convert JSON to Base64
    try:
        with open(json_file, 'r') as f:
            credentials_json = f.read()
        
        # Validate JSON
        json.loads(credentials_json)
        
        # Convert to Base64
        credentials_b64 = base64.b64encode(credentials_json.encode('utf-8')).decode('utf-8')
        
        # Update .env.local
        update_env_file(env_file, credentials_b64)
        
        print("✅ Google Vision API credentials configured successfully!")
        print("You can now use real OCR functionality in Menu Maker.")
        
    except Exception as e:
        print(f"❌ Error processing JSON file: {e}")
        print("Please make sure you have a valid Google Service Account JSON key file.")

def create_env_file(env_file):
    """Create .env.local file with template"""
    content = """# Google Vision API
GOOGLE_CREDENTIALS_B64=your_base64_encoded_service_account_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# API Configuration
API_HOST=127.0.0.1
API_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000
"""
    with open(env_file, 'w') as f:
        f.write(content)
    print(f"✅ Created {env_file}")

def get_current_credentials():
    """Get current GOOGLE_CREDENTIALS_B64 from .env.local"""
    try:
        with open('.env.local', 'r') as f:
            for line in f:
                if line.startswith('GOOGLE_CREDENTIALS_B64='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    return None

def update_env_file(env_file, credentials_b64):
    """Update .env.local with new credentials"""
    lines = []
    updated = False
    
    try:
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('GOOGLE_CREDENTIALS_B64='):
                    lines.append(f'GOOGLE_CREDENTIALS_B64={credentials_b64}\n')
                    updated = True
                else:
                    lines.append(line)
    except FileNotFoundError:
        pass
    
    if not updated:
        lines.append(f'GOOGLE_CREDENTIALS_B64={credentials_b64}\n')
    
    with open(env_file, 'w') as f:
        f.writelines(lines)
    
    # Also copy to apps/api/.env.local
    api_env_file = "apps/api/.env.local"
    with open(api_env_file, 'w') as f:
        f.writelines(lines)

if __name__ == "__main__":
    main() 