import os
import base64
import json
import re
from dotenv import load_dotenv

# Load current credentials
load_dotenv('.env.local')
creds_b64 = os.getenv('GOOGLE_CREDENTIALS_B64')

if not creds_b64:
    print("❌ No credentials found")
    exit(1)

# Decode base64
decoded = base64.b64decode(creds_b64).decode('utf-8')
print(f"Original length: {len(decoded)}")

# Fix escape sequences in private key
# The private key should have proper newlines, not escaped characters
private_key_pattern = r'"private_key":"([^"]*)"'
match = re.search(private_key_pattern, decoded)

if match:
    private_key_escaped = match.group(1)
    print(f"Found private key, length: {len(private_key_escaped)}")
    
    # Fix the private key by replacing incorrect escapes
    fixed_private_key = private_key_escaped.replace('\\n', '\n').replace('\\m', '\n')
    
    # Replace in the JSON
    fixed_json = decoded.replace(match.group(0), f'"private_key":"{fixed_private_key}"')
    
    # Test if JSON is valid
    try:
        json.loads(fixed_json)
        print("✅ Fixed JSON is valid")
        
        # Re-encode to base64
        fixed_b64 = base64.b64encode(fixed_json.encode('utf-8')).decode('utf-8')
        
        # Update .env.local
        with open('.env.local', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the credentials line
        new_content = re.sub(
            r'GOOGLE_CREDENTIALS_B64=.*',
            f'GOOGLE_CREDENTIALS_B64={fixed_b64}',
            content
        )
        
        with open('.env.local', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Updated .env.local with fixed credentials")
        
    except json.JSONDecodeError as e:
        print(f"❌ Still invalid JSON: {e}")
else:
    print("❌ Could not find private_key in JSON") 