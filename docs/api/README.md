# MastroHub API Documentation

Welcome to the MastroHub API documentation. This comprehensive guide covers all API endpoints, authentication, and integration examples.

## 🔑 Authentication

### API Keys
All API requests require authentication using API keys:

```bash
Authorization: Bearer YOUR_API_KEY
```

### JWT Tokens
For user-specific operations, use JWT tokens:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 Base URL

```
Production: https://api.mastrohub.com/v1
Staging: https://staging-api.mastrohub.com/v1
Development: http://localhost:3000/api
```

## 🚀 Quick Start

### 1. Get API Key
```bash
curl -X POST https://api.mastrohub.com/v1/auth/api-key \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'
```

### 2. Make Your First Request
```bash
curl -X GET https://api.mastrohub.com/v1/menu/items \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 📋 API Endpoints

### Authentication

#### POST /auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "owner",
    "workspace_id": "workspace_456"
  }
}
```

#### POST /auth/register
Register new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "restaurant_name": "My Restaurant",
  "cuisine_type": "italian"
}
```

### Menu Management

#### GET /menu/items
Get all menu items for the current workspace.

**Parameters:**
- `category_id` (optional): Filter by category
- `is_active` (optional): Filter by active status
- `limit` (optional): Number of items per page (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "item_123",
      "name": "Margherita Pizza",
      "description": "Classic tomato and mozzarella",
      "price": 12.99,
      "category_id": "cat_456",
      "category_name": "Pizza",
      "image_url": "https://...",
      "is_vegetarian": true,
      "is_vegan": false,
      "is_gluten_free": false,
      "allergens": ["dairy"],
      "preparation_time": 15,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

#### POST /menu/items
Create a new menu item.

**Request:**
```json
{
  "name": "New Dish",
  "description": "Delicious new creation",
  "price": 15.99,
  "category_id": "cat_123",
  "image_url": "https://...",
  "is_vegetarian": false,
  "is_vegan": false,
  "is_gluten_free": true,
  "allergens": ["nuts"],
  "preparation_time": 20,
  "tags": ["popular", "seasonal"]
}
```

#### PUT /menu/items/{id}
Update an existing menu item.

**Request:**
```json
{
  "name": "Updated Dish Name",
  "price": 16.99,
  "is_active": true
}
```

#### DELETE /menu/items/{id}
Delete a menu item.

**Response:**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

### Categories

#### GET /menu/categories
Get all menu categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "Appetizers",
      "description": "Start your meal right",
      "sort_order": 1,
      "is_active": true,
      "item_count": 8
    }
  ]
}
```

#### POST /menu/categories
Create a new category.

**Request:**
```json
{
  "name": "Desserts",
  "description": "Sweet endings",
  "sort_order": 5
}
```

### AI Assistant

#### POST /ai/chat
Send message to AI assistant.

**Request:**
```json
{
  "message": "How can I improve my menu?",
  "context": {
    "restaurant_type": "italian",
    "current_menu_items": 25,
    "average_price": 18.50
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on your Italian restaurant with 25 items averaging $18.50, I recommend...",
  "suggestions": [
    "Add seasonal specials",
    "Consider vegetarian options",
    "Review pricing strategy"
  ]
}
```

#### POST /ai/interview
Start AI interview for menu creation.

**Request:**
```json
{
  "restaurant_type": "italian",
  "cuisine_style": "traditional",
  "price_range": "mid-range",
  "target_audience": "families"
}
```

**Response:**
```json
{
  "success": true,
  "interview_id": "interview_123",
  "questions": [
    {
      "id": "q1",
      "question": "What's your signature dish?",
      "type": "text",
      "required": true
    }
  ]
}
```

### Analytics

#### GET /analytics/dashboard
Get dashboard analytics.

**Parameters:**
- `period` (optional): "day", "week", "month", "year" (default: "month")
- `start_date` (optional): Start date for custom period
- `end_date` (optional): End date for custom period

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 15420.50,
      "change": 12.5,
      "trend": "up"
    },
    "orders": {
      "total": 342,
      "change": 8.2,
      "trend": "up"
    },
    "customers": {
      "total": 156,
      "change": 15.3,
      "trend": "up"
    },
    "top_items": [
      {
        "name": "Margherita Pizza",
        "sales": 45,
        "revenue": 584.55
      }
    ]
  }
}
```

#### GET /analytics/menu-performance
Get menu performance analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "best_sellers": [...],
    "low_performers": [...],
    "profit_margins": [...],
    "category_performance": [...]
  }
}
```

### User Management

#### GET /users
Get all users in workspace.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "chef@restaurant.com",
      "role": "chef",
      "name": "John Chef",
      "is_active": true,
      "last_login": "2024-01-15T09:30:00Z"
    }
  ]
}
```

#### POST /users/invite
Invite new user to workspace.

**Request:**
```json
{
  "email": "newuser@restaurant.com",
  "role": "waiter",
  "name": "Jane Waiter"
}
```

### Settings

#### GET /settings
Get workspace settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurant_name": "My Restaurant",
    "cuisine_type": "italian",
    "timezone": "Europe/Bratislava",
    "language": "sk",
    "currency": "EUR",
    "business_hours": {
      "monday": {"open": "09:00", "close": "22:00"},
      "tuesday": {"open": "09:00", "close": "22:00"}
    }
  }
}
```

#### PUT /settings
Update workspace settings.

**Request:**
```json
{
  "restaurant_name": "Updated Restaurant Name",
  "business_hours": {
    "monday": {"open": "10:00", "close": "23:00"}
  }
}
```

## 🔧 SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @mastrohub/api-client
```

```javascript
import { MastroHubClient } from '@mastrohub/api-client';

const client = new MastroHubClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.mastrohub.com/v1'
});

// Get menu items
const items = await client.menu.getItems();

// Create new item
const newItem = await client.menu.createItem({
  name: 'New Dish',
  price: 15.99
});
```

### Python
```bash
pip install mastrohub-api
```

```python
from mastrohub import MastroHubClient

client = MastroHubClient(
    api_key='YOUR_API_KEY',
    base_url='https://api.mastrohub.com/v1'
)

# Get menu items
items = client.menu.get_items()

# Create new item
new_item = client.menu.create_item({
    'name': 'New Dish',
    'price': 15.99
})
```

## 📊 Rate Limits

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Authentication | 10 requests | 1 minute |
| Menu Operations | 100 requests | 1 minute |
| Analytics | 50 requests | 1 minute |
| AI Operations | 20 requests | 1 minute |

## 🛡️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "price",
      "issue": "Must be a positive number"
    }
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTHENTICATION_ERROR` | Invalid API key or token | 401 |
| `AUTHORIZATION_ERROR` | Insufficient permissions | 403 |
| `VALIDATION_ERROR` | Invalid request data | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 📝 Webhooks

### Configure Webhooks
```bash
curl -X POST https://api.mastrohub.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks",
    "events": ["menu.item.created", "menu.item.updated"],
    "secret": "your_webhook_secret"
  }'
```

### Webhook Events
- `menu.item.created` - New menu item created
- `menu.item.updated` - Menu item updated
- `menu.item.deleted` - Menu item deleted
- `user.invited` - New user invited
- `analytics.report.generated` - Analytics report ready

### Webhook Payload Example
```json
{
  "event": "menu.item.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "item_id": "item_123",
    "name": "New Dish",
    "price": 15.99
  }
}
```

## 🔍 Testing

### Test Environment
Use the staging environment for testing:
```
https://staging-api.mastrohub.com/v1
```

### Test API Key
```bash
# Get test API key
curl -X POST https://staging-api.mastrohub.com/v1/auth/test-key
```

## 📞 Support

### API Support
- **Documentation**: This comprehensive guide
- **SDKs**: Official libraries for popular languages
- **Examples**: Code samples and tutorials
- **Community**: Developer forum and discussions

### Contact
- **Email**: api-support@mastrohub.com
- **Slack**: Join our developer community
- **GitHub**: Report issues and feature requests

---

**Last Updated**: January 15, 2024  
**API Version**: v1.0.0  
**Maintained by**: MastroHub Development Team
