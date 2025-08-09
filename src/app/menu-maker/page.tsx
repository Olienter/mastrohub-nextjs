'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Grid,
  List,
  Menu,
  Leaf,
  
  ArrowLeft,
  UtensilsCrossed,
  DollarSign,
  Clock,
  Star,
  Tag,
  Hash,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Brain,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Wand2,
  Camera,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  Bell,
  User,
  Crown,
  Trophy,
  TrendingUp,
  TrendingDown,
  Percent,
  Package,
  FileText,
  Printer,
  Share2,
  Download,
  Upload,
  RotateCcw,
  Calculator,
  Image as ImageIcon,
  Upload as UploadIcon,
  FileText as FileTextIcon,
  Hash as HashIcon,
  PenTool,
  Folder as FolderIcon,
  AlertCircle
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import AIInterview from '@/components/menu-maker/AIInterview';
import AIAssistantWidget from '@/components/menu-maker/AIAssistantWidget';
import { RestaurantContext } from '@/lib/ai-agent';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id?: string;
  category_name?: string;
  image_url?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  preparation_time?: number;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  manuals?: {
    chef?: any;
    waiter?: any;
    marketing?: any;
    analytics?: any;
    supply_chain?: any;
    financial?: any;
    sustainability?: any;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MenuData {
  menu_items: MenuItem[];
  categories: Category[];
}

export default function MenuMaker() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [menuData, setMenuData] = useState<MenuData>({ menu_items: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [showMenuItemDetail, setShowMenuItemDetail] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showAIInterview, setShowAIInterview] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // New item form
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    tags: [] as string[],
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    allergens: [] as string[],
    preparation_time: 0
  });

  // Load menu data
  const loadMenuData = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/menu?workspace_id=${currentWorkspace.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load menu data');
      }
      
      setMenuData(data);
    } catch (err) {
      console.error('Error loading menu data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  // Create new menu item
  const createMenuItem = async () => {
    if (!currentWorkspace) return;
    
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace_id: currentWorkspace.id,
          ...newItem
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create menu item');
      }
      
      // Reload menu data
      await loadMenuData();
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        tags: [],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        allergens: [],
        preparation_time: 0
      });
      
      setShowAddItemModal(false);
    } catch (err) {
      console.error('Error creating menu item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create menu item');
    }
  };

  // Update menu item
  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update menu item');
      }
      
      // Reload menu data
      await loadMenuData();
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
    }
  };

  // Delete menu item
  const deleteMenuItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete menu item');
      }
      
      // Reload menu data
      await loadMenuData();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
    }
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    let items = menuData.menu_items;
    
    // Filter by search term
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (activeCategoryFilter !== 'all') {
      items = items.filter(item => item.category_id === activeCategoryFilter);
    }
    
    return items;
  }, [menuData.menu_items, searchTerm, activeCategoryFilter]);

  // Load data on mount and when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadMenuData();
    }
  }, [currentWorkspace]);

  // AI Interview handlers
  const handleAIInterviewComplete = async (manuals: any) => {
    if (selectedMenuItem) {
      // Update the menu item with the generated manuals
      await updateMenuItem(selectedMenuItem.id, {
        manuals: manuals
      });
    }
    setShowAIInterview(false);
  };

  const handleAIInterviewCancel = () => {
    setShowAIInterview(false);
  };

  // Create restaurant context for AI Assistant
  const createRestaurantContext = (): RestaurantContext => {
    return {
      restaurantName: currentWorkspace?.name || 'Restaurant',
      menuItems: menuData.menu_items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category_name || 'main',
        ingredients: [],
        prepTime: item.preparation_time || 15,
        cuisine: 'International',
        dietary: item.is_vegetarian ? ['vegetarian'] : item.is_vegan ? ['vegan'] : [],
        seasonality: 'year-round',
        targetAudience: 'general'
      })),
      cuisine: currentWorkspace?.cuisine || 'International',
      location: currentWorkspace?.location || 'Bratislava',
      targetAudience: ['general', 'food-lovers'],
      priceRange: 'mid-range',
      totalRevenue: 45000,
      averageOrderValue: 36.31,
      customerCount: 1247,
      popularItems: menuData.menu_items.slice(0, 5).map(item => item.name),
      seasonalTrends: ['Summer favorites', 'Winter comfort'],
      availableTools: ['Menu Maker', 'QR Menu', 'Analytics'],
      qrMenuEnabled: true,
      analyticsEnabled: true,
      marketingEnabled: true
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">No workspace selected</div>
          <Link 
            href="/restaurant-curator"
            className="text-blue-600 hover:text-blue-800"
          >
            Select a workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/restaurant-curator"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Restaurant Curator
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                Menu Maker - {currentWorkspace.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAIInterview(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Interview
              </button>
              
              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {menuData.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600">
                          €{item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {item.is_vegetarian && <Leaf className="h-4 w-4 text-green-500" />}
                          {item.is_vegan && <Hash className="h-4 w-4 text-green-600" />}
                          {item.is_gluten_free && <Tag className="h-4 w-4 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.preparation_time && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.preparation_time}min
                        </span>
                      )}
                      {item.category_name && (
                        <span className="flex items-center">
                          <Menu className="h-4 w-4 mr-1" />
                          {item.category_name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item);
                          setShowMenuItemDetail(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item);
                          setShowAIInterview(true);
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No menu items found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeCategoryFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first menu item'
              }
            </p>
            {!searchTerm && activeCategoryFilter === 'all' && (
              <button
                onClick={() => setShowAddItemModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI Assistant Widget */}
      <AIAssistantWidget restaurantContext={createRestaurantContext()} />

      {/* AI Interview Modal */}
      {showAIInterview && selectedMenuItem && (
        <AIInterview
          onComplete={handleAIInterviewComplete}
          onCancel={handleAIInterviewCancel}
        />
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Menu Item</h2>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); createMenuItem(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category_id}
                      onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {menuData.categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_vegetarian}
                      onChange={(e) => setNewItem({...newItem, is_vegetarian: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_vegan}
                      onChange={(e) => setNewItem({...newItem, is_vegan: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Vegan</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_gluten_free}
                      onChange={(e) => setNewItem({...newItem, is_gluten_free: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Gluten Free</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 