from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import base64
import json
from typing import List, Dict, Any
from google.cloud import vision
from dotenv import load_dotenv
import io

load_dotenv('.env.local')

app = FastAPI(title="MastroHub API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Vision client
def get_vision_client():
    try:
        # Get credentials from base64 environment variable
        credentials_b64 = os.getenv("GOOGLE_CREDENTIALS_B64")
        if not credentials_b64 or credentials_b64 == "your_base64_encoded_service_account_key_here":
            print("❌ Google Vision API credentials not configured")
            print("Please set GOOGLE_CREDENTIALS_B64 in .env.local with your actual Google Service Account key")
            return None
        
        # Decode base64 credentials
        credentials_json = base64.b64decode(credentials_b64).decode('utf-8')
        credentials_info = json.loads(credentials_json)
        
        # Create client with credentials
        client = vision.ImageAnnotatorClient.from_service_account_info(credentials_info)
        print("✅ Google Vision client created successfully")
        return client
    except Exception as e:
        print(f"❌ Error initializing Vision client: {str(e)}")
        return None

@app.get("/")
async def root():
    return {"message": "MastroHub API is running"}

@app.post("/ocr")
async def process_image(file: UploadFile = File(...)):
    """
    Process uploaded image using Google Vision OCR
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image content
        image_content = await file.read()
        
        # Create Vision client
        client = get_vision_client()
        
        if client is None:
            raise HTTPException(
                status_code=500, 
                detail="Google Vision API credentials not configured. Please set GOOGLE_CREDENTIALS_B64 in .env.local with your actual Google Service Account key"
            )
        
        # Create image object
        image = vision.Image(content=image_content)
        
        # Perform text detection with real Google Vision API
        print("🔍 Processing image with Google Vision API...")
        response = client.text_detection(image=image)
        texts = response.text_annotations
        
        if not texts:
            return {
                "success": False,
                "error": "No text detected in image",
                "texts": []
            }
        
        print(f"✅ Found {len(texts)-1} text elements in image")
        
        # Extract text data
        extracted_texts = []
        for text in texts[1:]:  # Skip the first element (contains all text)
            vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
            extracted_texts.append({
                "text": text.description,
                "confidence": text.confidence if hasattr(text, 'confidence') else 0.0,
                "boundingBox": {
                    "x": min(v[0] for v in vertices),
                    "y": min(v[1] for v in vertices),
                    "width": max(v[0] for v in vertices) - min(v[0] for v in vertices),
                    "height": max(v[1] for v in vertices) - min(v[1] for v in vertices)
                }
            })
        
        # Parse menu items
        menu_data = parse_menu_text(extracted_texts)
        
        return {
            "success": True,
            "menu_id": menu_data["menu_id"],
            "sections": menu_data["sections"],
            "texts": extracted_texts
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

def parse_menu_text(texts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Parse extracted text into menu sections and items
    """
    # Sort texts by Y position (top to bottom)
    sorted_texts = sorted(texts, key=lambda x: x["boundingBox"]["y"])
    
    # Group texts into lines
    line_threshold = 30
    menu_lines = []
    current_line = []
    current_y = -1
    
    for text in sorted_texts:
        text_content = text["text"].strip()
        
        if len(text_content) < 1:
            continue
        
        # Skip headers
        if any(keyword in text_content.lower() for keyword in ['about contrasts', 'all menus', 'food']):
            continue
        
        # Group into lines based on Y position
        if current_y == -1 or abs(text["boundingBox"]["y"] - current_y) > line_threshold:
            if current_line:
                line_text = " ".join(current_line).strip()
                if line_text:
                    menu_lines.append(line_text)
            current_line = [text_content]
            current_y = text["boundingBox"]["y"]
        else:
            current_line.append(text_content)
    
    # Add last line
    if current_line:
        line_text = " ".join(current_line).strip()
        if line_text:
            menu_lines.append(line_text)
    
    # Parse into sections and items
    sections = []
    current_section = {"title": "Main Menu", "items": []}
    
    for line in menu_lines:
        if len(line) < 2:
            continue
        
        # Check if it's a section header
        if line.endswith(':') or 'menu' in line.lower():
            if current_section["items"]:
                sections.append(current_section)
            current_section = {"title": line.replace(':', '').strip(), "items": []}
        else:
            # Parse item
            name = line
            description = ""
            price = 0
            
            # Extract price
            import re
            price_match = re.search(r'(\d+[.,]\d{2}|\d+\s*[€$])', line)
            if price_match:
                price_text = price_match.group(0).replace('€', '').replace('$', '').replace(' ', '')
                try:
                    price = float(price_text.replace(',', '.'))
                    name = line.replace(price_match.group(0), '').strip()
                except ValueError:
                    pass
            
            # Extract description
            if ' - ' in name or ', ' in name:
                parts = name.split(' - ') if ' - ' in name else name.split(', ')
                name = parts[0].strip()
                description = parts[1].strip() if len(parts) > 1 else ""
            
            current_section["items"].append({
                "id": f"item-{len(current_section['items'])}",
                "name": name.replace(':', '').replace(';', '').strip(),
                "description_raw": description,
                "price": price
            })
    
    # Add last section
    if current_section["items"]:
        sections.append(current_section)
    
    return {
        "menu_id": f"menu-{len(menu_lines)}",
        "sections": sections
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 