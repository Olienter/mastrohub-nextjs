import json
import base64
import sys

def convert_json_to_base64(json_file_path):
    """Convert Google Service Account JSON to base64 for .env.local"""
    
    try:
        # Read the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as f:
            credentials = json.load(f)
        
        # Validate it's a service account key
        if 'type' not in credentials or credentials['type'] != 'service_account':
            print("❌ Error: This doesn't appear to be a Google Service Account key")
            return False
        
        # Convert to base64
        json_string = json.dumps(credentials, separators=(',', ':'))
        base64_credentials = base64.b64encode(json_string.encode('utf-8')).decode('utf-8')
        
        print(f"✅ Successfully converted credentials")
        print(f"📄 Project ID: {credentials.get('project_id', 'Unknown')}")
        print(f"📧 Client Email: {credentials.get('client_email', 'Unknown')}")
        print(f"🔑 Base64 length: {len(base64_credentials)}")
        
        # Update .env.local
        try:
            with open('.env.local', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the GOOGLE_CREDENTIALS_B64 line
            import re
            if 'GOOGLE_CREDENTIALS_B64=' in content:
                # Replace existing line
                new_content = re.sub(
                    r'GOOGLE_CREDENTIALS_B64=.*',
                    f'GOOGLE_CREDENTIALS_B64={base64_credentials}',
                    content
                )
            else:
                # Add new line
                new_content = content + f'\nGOOGLE_CREDENTIALS_B64={base64_credentials}'
            
            with open('.env.local', 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print("✅ Updated .env.local with new credentials")
            return True
            
        except Exception as e:
            print(f"❌ Error updating .env.local: {e}")
            print(f"📋 Manual update: Add this line to .env.local:")
            print(f"GOOGLE_CREDENTIALS_B64={base64_credentials}")
            return False
            
    except FileNotFoundError:
        print(f"❌ Error: File '{json_file_path}' not found")
        return False
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in '{json_file_path}'")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_credentials.py <path-to-google-service-account.json>")
        print("Example: python convert_credentials.py ./google-service-account.json")
        sys.exit(1)
    
    json_file = sys.argv[1]
    success = convert_json_to_base64(json_file)
    
    if success:
        print("\n🎉 Credentials converted successfully!")
        print("🔄 Restart your FastAPI server to use the new credentials")
    else:
        sys.exit(1) 