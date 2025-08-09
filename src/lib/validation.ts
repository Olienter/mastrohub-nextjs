import { z } from 'zod'
import { logger } from './logger'

// Common validation schemas
export const validationSchemas = {
  // User validation
  user: {
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  },

  // Menu validation
  menu: {
    name: z.string().min(1, 'Menu name is required').max(100, 'Menu name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    isActive: z.boolean().default(true),
    settings: z.record(z.string(), z.any()).optional(),
  },

  // Menu item validation
  menuItem: {
    name: z.string().min(1, 'Item name is required').max(100, 'Item name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    price: z.number().positive('Price must be positive'),
    category: z.string().max(50, 'Category must be less than 50 characters').optional(),
    isAvailable: z.boolean().default(true),
    imageUrl: z.string().url('Invalid image URL').optional(),
    allergens: z.array(z.string()).default([]),
    nutritionalInfo: z.record(z.string(), z.any()).default({}),
  },

  // Order validation
  order: {
    customerName: z.string().min(1, 'Customer name is required').max(100, 'Customer name must be less than 100 characters'),
    customerEmail: z.string().email('Invalid email address').optional(),
    customerPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
    totalAmount: z.number().positive('Total amount must be positive'),
    status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).default('pending'),
    paymentMethod: z.enum(['cash', 'card', 'online']).optional(),
    notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  },

  // Order item validation
  orderItem: {
    menuItemId: z.string().uuid('Invalid menu item ID'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    unitPrice: z.number().positive('Unit price must be positive'),
    totalPrice: z.number().positive('Total price must be positive'),
    specialInstructions: z.string().max(200, 'Special instructions must be less than 200 characters').optional(),
  },

  // Ingredient validation
  ingredient: {
    name: z.string().min(1, 'Ingredient name is required').max(100, 'Ingredient name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    unit: z.string().max(20, 'Unit must be less than 20 characters').optional(),
    costPerUnit: z.number().nonnegative('Cost per unit must be non-negative').optional(),
    supplier: z.string().max(100, 'Supplier must be less than 100 characters').optional(),
    stockQuantity: z.number().nonnegative('Stock quantity must be non-negative').default(0),
    minStockLevel: z.number().nonnegative('Minimum stock level must be non-negative').default(0),
  },

  // API request validation
  api: {
    pagination: z.object({
      page: z.number().int().positive('Page must be a positive integer').default(1),
      limit: z.number().int().positive('Limit must be a positive integer').max(100, 'Limit cannot exceed 100').default(10),
    }),
    
    search: z.object({
      query: z.string().min(1, 'Search query is required').max(200, 'Search query must be less than 200 characters'),
      filters: z.record(z.string(), z.any()).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
  },

  // File upload validation
  file: {
    image: z.object({
      size: z.number().max(5 * 1024 * 1024, 'Image size must be less than 5MB'),
      type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Invalid image type'),
    }),
    
    document: z.object({
      size: z.number().max(10 * 1024 * 1024, 'Document size must be less than 10MB'),
      type: z.string().regex(/^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/, 'Invalid document type'),
    }),
  },
}

// Validation helper functions
export const validationHelpers = {
  // Validate and parse data
  validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      const result = schema.parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(err => err.message)
        logger.warn('Validation failed', { errors, data })
        return { success: false, errors }
      }
      logger.error('Validation error', { error, data })
      return { success: false, errors: ['Validation failed'] }
    }
  },

  // Validate and parse data safely (returns undefined on failure)
  validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): T | undefined {
    const result = schema.safeParse(data)
    if (result.success) {
      return result.data
    }
    logger.warn('Validation failed', { errors: result.error.errors, data })
    return undefined
  },

  // Validate partial data
  validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: Partial<T> } | { success: false; errors: string[] } {
    try {
      const result = schema.partial().parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(err => err.message)
        logger.warn('Partial validation failed', { errors, data })
        return { success: false, errors }
      }
      return { success: false, errors: ['Unknown validation error'] }
    }
  },

  // Validate array of data
  validateArray<T>(schema: z.ZodSchema<T>, data: unknown[]): { success: true; data: T[] } | { success: false; errors: string[] } {
    try {
      const result = z.array(schema).parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message)
        logger.warn('Array validation failed', { errors, data })
        return { success: false, errors }
      }
      return { success: false, errors: ['Unknown validation error'] }
    }
  },

  // Sanitize input data
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
  },

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailSchema = z.string().email()
    return emailSchema.safeParse(email).success
  },

  // Validate phone number format
  isValidPhone(phone: string): boolean {
    const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/)
    return phoneSchema.safeParse(phone).success
  },

  // Validate URL format
  isValidUrl(url: string): boolean {
    const urlSchema = z.string().url()
    return urlSchema.safeParse(url).success
  },

  // Validate UUID format
  isValidUuid(uuid: string): boolean {
    const uuidSchema = z.string().uuid()
    return uuidSchema.safeParse(uuid).success
  },
}

// Custom validation functions
export const customValidators = {
  // Validate password strength
  passwordStrength: (password: string): { isValid: boolean; score: number; feedback: string[] } => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push('Password must be at least 8 characters long')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Password must contain at least one lowercase letter')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Password must contain at least one uppercase letter')

    if (/[0-9]/.test(password)) score += 1
    else feedback.push('Password must contain at least one number')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('Password must contain at least one special character')

    return {
      isValid: score >= 4,
      score,
      feedback,
    }
  },

  // Validate credit card number (Luhn algorithm)
  isValidCreditCard: (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false

    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i))

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  },

  // Validate postal code format
  isValidPostalCode: (postalCode: string, country: string = 'US'): boolean => {
    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/,
    }

    const pattern = patterns[country] || patterns.US
    return pattern.test(postalCode)
  },

  // Validate date format
  isValidDate: (dateString: string): boolean => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  },

  // Validate future date
  isFutureDate: (dateString: string): boolean => {
    const date = new Date(dateString)
    const now = new Date()
    return date > now
  },

  // Validate past date
  isPastDate: (dateString: string): boolean => {
    const date = new Date(dateString)
    const now = new Date()
    return date < now
  },
}

// Export validation utilities
export const validation = {
  schemas: validationSchemas,
  helpers: validationHelpers,
  custom: customValidators,
}
