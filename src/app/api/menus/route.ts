import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorBoundary, validateBody, successResponse, errorResponse } from '@/lib/http'
import { logger } from '@/lib/logger'

// Zod schemas
const createMenuSchema = z.object({
  name: z.string().min(1, 'Menu name is required').max(100),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  settings: z.record(z.any()).optional(),
})

const updateMenuSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
})

const menuQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
  is_active: z.string().optional().transform(val => val === 'true'),
})

// Mock data for development
const mockMenus = [
  {
    id: '1',
    name: 'Main Menu',
    description: 'Our main restaurant menu',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lunch Special',
    description: 'Daily lunch specials',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

async function handleGetMenus(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const page = parseInt(query.get('page') || '1')
  const limit = parseInt(query.get('limit') || '10')
  const isActive = query.get('is_active') === 'true'
  
  try {
    // TODO: Replace with actual database query
    let filteredMenus = mockMenus
    
    if (isActive !== null) {
      filteredMenus = mockMenus.filter(menu => menu.is_active === isActive)
    }
    
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedMenus = filteredMenus.slice(start, end)
    
    logger.info('Get menus', { page, limit, count: paginatedMenus.length })
    
    return successResponse({
      menus: paginatedMenus,
      pagination: {
        page,
        limit,
        total: filteredMenus.length,
        pages: Math.ceil(filteredMenus.length / limit),
      },
    })
  } catch (error) {
    logger.error('Get menus error:', error)
    return errorResponse('Failed to fetch menus', 500)
  }
}

async function handleCreateMenu(request: NextRequest) {
  try {
    const body = await validateBody(request, createMenuSchema)
    
    // TODO: Replace with actual database insert
    const newMenu = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    logger.info('Create menu', { menuId: newMenu.id, name: newMenu.name })
    
    return successResponse(newMenu, 201)
  } catch (error) {
    logger.error('Create menu error:', error)
    return errorResponse('Failed to create menu', 400)
  }
}

async function handleMenus(request: NextRequest) {
  if (request.method === 'GET') {
    return handleGetMenus(request)
  } else if (request.method === 'POST') {
    return handleCreateMenu(request)
  } else {
    return errorResponse('Method not allowed', 405)
  }
}

export const GET = withErrorBoundary(handleGetMenus)
export const POST = withErrorBoundary(handleCreateMenu)
