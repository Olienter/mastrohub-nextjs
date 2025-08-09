import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import React from 'react'
import { logger } from './logger'

// Test utilities for React components
export const testUtils = {
  // Custom render function with providers
  renderWithProviders: (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
  ) => {
    const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
      return React.createElement('div', { 'data-testid': 'test-wrapper' }, children)
    }

    return render(ui, { wrapper: AllTheProviders, ...options })
  },

  // Mock logger for tests
  mockLogger: () => {
    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    }

    jest.spyOn(logger, 'info').mockImplementation(mockLogger.info)
    jest.spyOn(logger, 'warn').mockImplementation(mockLogger.warn)
    jest.spyOn(logger, 'error').mockImplementation(mockLogger.error)
    jest.spyOn(logger, 'debug').mockImplementation(mockLogger.debug)

    return mockLogger
  },

  // Mock fetch for API tests
  mockFetch: (response: any, status: number = 200) => {
    const mockResponse = {
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      text: async () => JSON.stringify(response),
      headers: new Headers(),
    }

    global.fetch = jest.fn().mockResolvedValue(mockResponse as Response)
    return global.fetch as jest.MockedFunction<typeof fetch>
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {}

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key]
        }),
        clear: jest.fn(() => {
          Object.keys(store).forEach(key => delete store[key])
        }),
        length: Object.keys(store).length,
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
      },
      writable: true,
    })
  },

  // Mock sessionStorage
  mockSessionStorage: () => {
    const store: Record<string, string> = {}

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key]
        }),
        clear: jest.fn(() => {
          Object.keys(store).forEach(key => delete store[key])
        }),
        length: Object.keys(store).length,
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
      },
      writable: true,
    })
  },

  // Mock window.location
  mockLocation: (url: string = 'http://localhost:3000') => {
    delete (window as any).location
    window.location = new URL(url) as any
  },

  // Mock window.matchMedia
  mockMatchMedia: (matches: boolean = true) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  },

  // Mock IntersectionObserver
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
  },

  // Mock ResizeObserver
  mockResizeObserver: () => {
    const mockResizeObserver = jest.fn()
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.ResizeObserver = mockResizeObserver
  },

  // Mock performance API
  mockPerformance: () => {
    Object.defineProperty(window, 'performance', {
      value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn(() => []),
        getEntriesByName: jest.fn(() => []),
        clearMarks: jest.fn(),
        clearMeasures: jest.fn(),
      },
      writable: true,
    })
  },

  // Mock crypto API
  mockCrypto: () => {
    Object.defineProperty(window, 'crypto', {
      value: {
        getRandomValues: jest.fn((arr) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256)
          }
          return arr
        }),
        randomUUID: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
      },
      writable: true,
    })
  },

  // Mock console methods
  mockConsole: () => {
    const originalConsole = { ...console }
    
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
      jest.spyOn(console, 'info').mockImplementation(() => {})
      jest.spyOn(console, 'debug').mockImplementation(() => {})
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    return originalConsole
  },

  // Create test data
  createTestData: {
    // Create test user
    user: (overrides: Partial<any> = {}) => ({
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }),

    // Create test menu
    menu: (overrides: Partial<any> = {}) => ({
      id: 'test-menu-id',
      name: 'Test Menu',
      description: 'Test menu description',
      is_active: true,
      owner_id: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }),

    // Create test menu item
    menuItem: (overrides: Partial<any> = {}) => ({
      id: 'test-menu-item-id',
      name: 'Test Menu Item',
      description: 'Test menu item description',
      price: 9.99,
      category: 'Main Course',
      is_available: true,
      menu_id: 'test-menu-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }),

    // Create test order
    order: (overrides: Partial<any> = {}) => ({
      id: 'test-order-id',
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      total_amount: 19.98,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }),

    // Create test ingredient
    ingredient: (overrides: Partial<any> = {}) => ({
      id: 'test-ingredient-id',
      name: 'Test Ingredient',
      description: 'Test ingredient description',
      unit: 'grams',
      cost_per_unit: 0.50,
      stock_quantity: 1000,
      min_stock_level: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }),
  },

  // Wait for async operations
  waitFor: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),

  // Wait for element to be in DOM
  waitForElement: async (selector: string, timeout: number = 5000) => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector)
      if (element) return element
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error(`Element ${selector} not found within ${timeout}ms`)
  },

  // Wait for condition to be true
  waitForCondition: async (condition: () => boolean, timeout: number = 5000) => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      if (condition()) return true
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error(`Condition not met within ${timeout}ms`)
  },

  // Mock API response
  mockApiResponse: (path: string, method: string = 'GET', response: any = {}) => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => response,
      text: async () => JSON.stringify(response),
    }

    global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
      if (url.includes(path) && (!options || options.method === method)) {
        return Promise.resolve(mockResponse as Response)
      }
      return Promise.reject(new Error('Not found'))
    })
  },

  // Mock API error
  mockApiError: (path: string, method: string = 'GET', status: number = 500) => {
    const mockResponse = {
      ok: false,
      status,
      json: async () => ({ error: 'Test error' }),
      text: async () => JSON.stringify({ error: 'Test error' }),
    }

    global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
      if (url.includes(path) && (!options || options.method === method)) {
        return Promise.resolve(mockResponse as Response)
      }
      return Promise.reject(new Error('Not found'))
    })
  },
}

// Test setup helpers
export const testSetup = {
  // Setup common mocks
  setupCommonMocks: () => {
    testUtils.mockLocalStorage()
    testUtils.mockSessionStorage()
    testUtils.mockLocation()
    testUtils.mockMatchMedia()
    testUtils.mockIntersectionObserver()
    testUtils.mockResizeObserver()
    testUtils.mockPerformance()
    testUtils.mockCrypto()
  },

  // Clean up after tests
  cleanup: () => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    localStorage.clear()
    sessionStorage.clear()
  },

  // Setup test environment
  setupTestEnvironment: () => {
    beforeAll(() => {
      testSetup.setupCommonMocks()
    })

    afterEach(() => {
      testSetup.cleanup()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })
  },
}

// Export test utilities
export const testHelpers = {
  utils: testUtils,
  setup: testSetup,
}
