// Application constants and configuration

// Environment
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  METRICS: '/api/metrics',
  LOGS: '/api/logs',
  ERRORS: '/api/errors',
  MENUS: '/api/menus',
  MENU: '/api/menu',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  AUTH: '/api/auth',
  UPLOAD: '/api/upload',
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  USER: 'user',
  GUEST: 'guest',
} as const

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online',
  MOBILE: 'mobile',
} as const

// Menu item categories
export const MENU_CATEGORIES = {
  APPETIZER: 'appetizer',
  MAIN_COURSE: 'main_course',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
  SIDE_DISH: 'side_dish',
  SALAD: 'salad',
  SOUP: 'soup',
  SANDWICH: 'sandwich',
  PASTA: 'pasta',
  PIZZA: 'pizza',
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 10,
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const

// Rate limiting
export const RATE_LIMITS = {
  API: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5,
  },
  UPLOAD: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10,
  },
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTES_LENGTH: 200,
  MAX_TITLE_LENGTH: 200,
  MAX_URL_LENGTH: 2048,
} as const

// Error messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  SESSION_EXPIRED: 'Session expired, please login again',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters long',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  
  // API
  API_ERROR: 'An error occurred while processing your request',
  NETWORK_ERROR: 'Network error, please check your connection',
  TIMEOUT_ERROR: 'Request timeout, please try again',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  
  // File upload
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',
  
  // Database
  DATABASE_ERROR: 'Database error occurred',
  RECORD_NOT_FOUND: 'Record not found',
  DUPLICATE_RECORD: 'Record already exists',
  
  // General
  UNKNOWN_ERROR: 'An unknown error occurred',
  NOT_IMPLEMENTED: 'This feature is not implemented yet',
  MAINTENANCE_MODE: 'System is under maintenance',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // CRUD operations
  CREATED: 'Record created successfully',
  UPDATED: 'Record updated successfully',
  DELETED: 'Record deleted successfully',
  
  // File upload
  UPLOAD_SUCCESS: 'File uploaded successfully',
  
  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  SAVED: 'Changes saved successfully',
} as const

// UI constants
export const UI = {
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Colors
  COLORS: {
    PRIMARY: '#1f2937',
    SECONDARY: '#6b7280',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
  
  // Animation durations
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Z-index levels
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
} as const

// Feature flags
export const FEATURES = {
  AI_ASSISTANT: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
  ANALYTICS: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  PWA: process.env.NEXT_PUBLIC_PWA_ENABLED === 'true',
  MULTI_LANGUAGE: process.env.NEXT_PUBLIC_MULTI_LANGUAGE === 'true',
  DARK_MODE: process.env.NEXT_PUBLIC_DARK_MODE === 'true',
  REAL_TIME_UPDATES: process.env.NEXT_PUBLIC_REAL_TIME_ENABLED === 'true',
} as const

// External services
export const EXTERNAL_SERVICES = {
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  REDIS: {
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  AI: {
    PROVIDER: process.env.AI_PROVIDER || 'openai',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  },
  ANALYTICS: {
    GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
} as const

// Application metadata
export const APP_METADATA = {
  NAME: 'MastroHub',
  DESCRIPTION: 'Comprehensive restaurant management platform with AI assistant',
  VERSION: process.env.npm_package_version || '0.1.0',
  AUTHOR: 'MastroHub Team',
  WEBSITE: 'https://mastrohub.com',
  SUPPORT_EMAIL: 'support@mastrohub.com',
} as const

// Export all constants
export const CONSTANTS = {
  ENV,
  API_ENDPOINTS,
  HTTP_STATUS,
  HTTP_METHODS,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  MENU_CATEGORIES,
  UPLOAD_LIMITS,
  CACHE_TTL,
  RATE_LIMITS,
  PAGINATION,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI,
  FEATURES,
  EXTERNAL_SERVICES,
  APP_METADATA,
} as const
