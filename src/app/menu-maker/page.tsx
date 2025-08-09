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
import ImageUpload from '@/components/menu-maker/ImageUpload';
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
  const [showImageUpload, setShowImageUpload] = useState(false);
  
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

  // Handle edit item
  const handleEditItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setShowAddItemModal(true);
  };

  // Handle delete item
  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(itemId);
        await loadMenuData();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  // Handle toggle item status
  const handleToggleItemStatus = async (item: MenuItem) => {
    try {
      const updatedItem = { ...item, is_active: !item.is_active };
      await updateMenuItem(updatedItem.id, updatedItem);
      await loadMenuData();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

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
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Link 
                href="/restaurant-curator"
                className="flex items-center text-muted hover:text-fg whitespace-nowrap"
              >
                <ArrowLeft className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Back to Restaurant Curator</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="h-6 w-px bg-border flex-shrink-0" />
              <h1 className="text-xl font-semibold text-fg truncate">
                Menu Maker - {currentWorkspace.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={() => setShowAIInterview(true)}
                className="flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <Sparkles className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">AI Interview</span>
                <span className="sm:hidden">AI</span>
              </button>
              
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <Camera className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">OCR Upload</span>
                <span className="sm:hidden">OCR</span>
              </button>
              
              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg placeholder-muted bg-surface"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg bg-surface"
            >
              <option value="all">All Categories</option>
              {menuData.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-border rounded-lg hover:bg-accent transition-colors text-fg"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setShowAIInterview(true)}
              className="flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              <Sparkles className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">AI Interview</span>
              <span className="sm:hidden">AI</span>
            </button>
            
            <button
              onClick={() => setShowImageUpload(true)}
              className="flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              <Upload className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Upload Menu</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <span className="text-destructive">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                className="bg-surface rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-fg mb-2 truncate">
                        {item.name}
                      </h3>
                      <p className="text-muted text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary flex-shrink-0">
                          €{item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {item.is_vegetarian && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Vegetarian
                            </span>
                          )}
                          {item.is_vegan && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Vegan
                            </span>
                          )}
                          {item.is_gluten_free && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Gluten Free
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted min-w-0 flex-1">
                    {item.preparation_time && (
                      <span className="flex items-center whitespace-nowrap">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        {item.preparation_time}min
                      </span>
                    )}
                    {item.category_name && (
                      <span className="flex items-center whitespace-nowrap">
                        <Menu className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{item.category_name}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="flex items-center px-3 py-1 text-sm text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex items-center px-3 py-1 text-sm text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleItemStatus(item)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          item.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
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
            <UtensilsCrossed className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg mb-2">No menu items found</h3>
            <p className="text-muted mb-6">
              {searchTerm || activeCategoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first menu item.'
              }
            </p>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </button>
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

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onImageProcessed={(menuData) => {
            console.log('Processed menu data:', menuData);
            setShowImageUpload(false);
            // TODO: Handle processed menu data
          }}
          onCancel={() => setShowImageUpload(false)}
        />
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-fg">Add Menu Item</h2>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-muted hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); createMenuItem(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg bg-surface"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg bg-surface"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Price (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg bg-surface"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category_id}
                      onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-fg bg-surface"
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
                    <span className="text-sm text-fg">Vegetarian</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_vegan}
                      onChange={(e) => setNewItem({...newItem, is_vegan: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-fg">Vegan</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.is_gluten_free}
                      onChange={(e) => setNewItem({...newItem, is_gluten_free: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-fg">Gluten Free</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-muted hover:text-fg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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