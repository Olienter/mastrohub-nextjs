'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), { ssr: false });
const MotionButton = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.button })), { ssr: false });
const MotionAnimatePresence = dynamic(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })), { ssr: false });

// Optimized icon imports - only essential ones
import {
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  UtensilsCrossed,
  DollarSign,
  Clock,
  Star,
  ArrowLeft,
  GripVertical,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  Calculator,
  TrendingUp,
  TrendingDown,
  Percent,
  Package,
  FileText,
  Printer,
  Share2,
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
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Upload as UploadIcon,
  FileText as FileTextIcon,
  Settings,
  Bell,
  User,
  Crown,
  Trophy,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Tag,
  Hash,
  Hash as HashIcon,
  PenTool,
  Folder as FolderIcon,
  Menu,
  Leaf
} from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import AIInterview from '@/components/menu-maker/AIInterview';
import { MenuData } from '@/lib/ai-agent';
import { MenuMakerService } from '@/lib/menuMaker';
import ChefTool from '@/components/menu-maker/ChefTool';
import WaiterTool from '@/components/menu-maker/WaiterTool';
import MarketingTool from '@/components/menu-maker/MarketingTool';
import AnalyticsTool from '@/components/menu-maker/AnalyticsTool';
import SupplyChainTool from '@/components/menu-maker/SupplyChainTool';
import FinancialTool from '@/components/menu-maker/FinancialTool';
import SustainabilityTool from '@/components/menu-maker/SustainabilityTool';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserProfile } from '@/components/menu-maker/UserProfile';
import ImageUpload from '@/components/menu-maker/ImageUpload';
import AIAssistantChat from '@/components/menu-maker/AIAssistantChat';
import { RestaurantContext } from '@/lib/ai-agent';
import AIAssistantWidget from '@/components/menu-maker/AIAssistantWidget';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  shares: number;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  allergens: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  instructions: string[];
  cost: number;
  profitMargin: number;
  
  // Social features
  comments: Comment[];
  ratings: Rating[];
  photos: string[];
  videoUrl?: string;
  
  // Chef Manual
  chefManual?: {
    equipment: string[]; // Kuchynské vybavenie
    substitutions: string[]; // Substitúcie ingrediencií
    garnishing: string; // Garnírovanie
    servingTemperature: 'hot' | 'warm' | 'cold'; // Teplota podávania
    portionSizes: {
      small: number;
      medium: number;
      large: number;
    };
    qualityNotes: string; // Poznámky o kvalite ingrediencií
    timingNotes: string; // Časové poznámky
  };
  
  // Waiter Manual
  waiterManual?: {
    customerDescription: string; // Popis pre zákazníka
    recommendations: string[]; // Odporúčania
    pairing: string[]; // Čo k tomu podávať
    specialRequests: string[]; // Špeciálne požiadavky
    portionInfo: string; // Informácie o porciách
    alternatives: string[]; // Alternatívy
    servingTime: number; // Čas podávania v minútach
  };
  
  // Marketing Manual
  marketingManual?: {
    story: string; // Príbeh jedla
    hashtags: string[]; // Hashtagy pre social media
    seasonality: string[]; // Sezónnosť
    targetAudience: string[]; // Cielová skupina
    trends: string[]; // Trendy
    background: string; // Pozadie a história
    chefStory: string; // Šéfkuchár story
    localIngredients: string[]; // Lokálne ingrediencie
  };
  
  // Analytics
  analytics?: {
    popularity: number; // Popularita (1-100)
    profitability: number; // Ziskovosť v %
    seasonalTrends: string[]; // Sezónne trendy
    customerRatings: number; // Priemerné hodnotenie
    returnRate: number; // Návratnosť zákazníkov
    preparationEfficiency: number; // Efektivita prípravy
  };
  
  // Supply Chain
  supplyChain?: {
    suppliers: string[]; // Dodávatelia
    minimumOrder: number; // Minimálne množstvo
    deliveryTime: number; // Čas dodania v dňoch
    storageInstructions: string; // Inštrukcie skladovania
    shelfLife: number; // Trvanlivosť v dňoch
    backupSuppliers: string[]; // Náhradní dodávatelia
  };
  
  // Financial
  financial?: {
    ingredientCosts: number; // Náklady na ingrediencie
    laborCosts: number; // Pracovné náklady
    margin: number; // Marža v %
    pricingStrategy: string; // Cenová stratégia
    competitorPrices: number[]; // Konkurenčné ceny
    seasonalPriceChanges: string[]; // Sezónne zmeny cien
  };
  
  // Sustainability
  sustainability?: {
    localIngredients: string[]; // Lokálne ingrediencie
    organicIngredients: string[]; // Bio ingrediencie
    wasteReduction: string; // Minimalizácia odpadu
    carbonFootprint: number; // Ekologická stopa
    seasonalAvailability: string[]; // Sezónna dostupnosť
  };
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  likes: number;
}

interface Rating {
  id: string;
  rating: number;
  author: string;
  comment?: string;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  items: MenuItem[];
  isActive: boolean;
  sortOrder: number;
}

interface ImportedProduct {
  id: string;
  name: string;
  price?: number;
  description?: string;
  category?: string;
  confidence: number;
  originalText: string;
  isProcessed: boolean;
}

export default function MenuMaker() {
  const { currentWorkspace, workspaces, selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();
  const { user, loading: authLoading } = useAuth();
  
  // Main states
  const [activeView, setActiveView] = useState<'onboarding' | 'feed' | 'import' | 'organize' | 'analytics'>('onboarding');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const [importMethod, setImportMethod] = useState<'vision' | 'manual'>('vision');
  
  // Import states
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Social states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'price' | 'name'>('popular');
  
  // Category management states
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  const [showCategoryItems, setShowCategoryItems] = useState(false);
  
  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  
  // Jedlo Profile states
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showMenuItemDetail, setShowMenuItemDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'chef' | 'waiter' | 'marketing' | 'analytics' | 'supply' | 'financial' | 'sustainability'>('chef');
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [showAIInterview, setShowAIInterview] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Manual Entry states
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [manualEntryForm, setManualEntryForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: '',
    allergens: '',
    ingredients: '',
    instructions: ''
  });
  
  // Mock data for social network
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Truffle Pasta Carbonara',
      description: 'Creamy pasta with black truffle, pancetta, and parmesan',
      price: 24.50,
      category: 'main-courses',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      isPopular: true,
      isFeatured: true,
      likes: 156,
      views: 1247,
      shares: 23,
      createdBy: 'Chef Marco',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      status: 'published',
      tags: ['pasta', 'truffle', 'italian', 'premium'],
      allergens: ['gluten', 'dairy'],
      preparationTime: 15,
      difficulty: 'medium',
      nutritionInfo: {
        calories: 650,
        protein: 25,
        carbs: 45,
        fat: 35
      },
      ingredients: ['pasta', 'eggs', 'pancetta', 'parmesan', 'truffle'],
      instructions: [
        'Boil pasta in salted water',
        'Cook pancetta until crispy',
        'Mix eggs with cheese',
        'Combine all ingredients'
      ],
      cost: 8.50,
      profitMargin: 65.3,
      
      // Chef Manual
      chefManual: {
        equipment: ['large pot', 'frying pan', 'grater', 'whisk'],
        substitutions: ['bacon for pancetta', 'pecorino for parmesan'],
        garnishing: 'Fresh parsley and black pepper',
        servingTemperature: 'hot',
        portionSizes: { small: 200, medium: 300, large: 400 },
        qualityNotes: 'Use fresh eggs and high-quality truffle',
        timingNotes: 'Start pasta 10 minutes before serving'
      },
      
      // Waiter Manual
      waiterManual: {
        customerDescription: 'Our signature pasta dish with black truffle and crispy pancetta',
        recommendations: ['Pair with Chianti wine', 'Add extra parmesan'],
        pairing: ['Chianti wine', 'Italian bread', 'Side salad'],
        specialRequests: ['No dairy', 'Extra truffle', 'Gluten-free pasta'],
        portionInfo: 'Generous portion, suitable for main course',
        alternatives: ['Vegetarian version', 'Spicy version'],
        servingTime: 5
      },
      
      // Marketing Manual
      marketingManual: {
        story: 'Inspired by traditional Roman cuisine, elevated with premium black truffle',
        hashtags: ['#trufflepasta', '#carbonara', '#italianfood', '#premium'],
        seasonality: ['autumn', 'winter'],
        targetAudience: ['food lovers', 'premium diners', 'italian cuisine fans'],
        trends: ['truffle trend', 'authentic italian'],
        background: 'Chef Marco learned this recipe in Rome',
        chefStory: 'Created during our first winter season',
        localIngredients: ['local eggs', 'italian parmesan']
      },
      
      // Analytics
      analytics: {
        popularity: 85,
        profitability: 65.3,
        seasonalTrends: ['winter favorite', 'holiday special'],
        customerRatings: 4.8,
        returnRate: 78,
        preparationEfficiency: 92
      },
      
      // Supply Chain
      supplyChain: {
        suppliers: ['Local Market', 'Italian Import Co'],
        minimumOrder: 10,
        deliveryTime: 2,
        storageInstructions: 'Keep truffle refrigerated, pasta in dry storage',
        shelfLife: 7,
        backupSuppliers: ['Premium Foods', 'Gourmet Market']
      },
      
      // Financial
      financial: {
        ingredientCosts: 8.50,
        laborCosts: 3.20,
        margin: 65.3,
        pricingStrategy: 'Premium pricing for luxury ingredients',
        competitorPrices: [22.00, 26.00, 28.00],
        seasonalPriceChanges: ['+15% in winter', '+10% during holidays']
      },
      
      // Sustainability
      sustainability: {
        localIngredients: ['eggs', 'parsley'],
        organicIngredients: ['organic eggs', 'organic parsley'],
        wasteReduction: 'Use leftover pasta water for sauce',
        carbonFootprint: 2.3,
        seasonalAvailability: ['truffle: autumn-winter', 'parsley: year-round']
      },
      
      comments: [
        {
          id: '1',
          text: 'Amazing dish! Our customers love it.',
          author: 'Chef Sarah',
          createdAt: new Date('2024-01-16'),
          likes: 12
        }
      ],
      ratings: [
        {
          id: '1',
          rating: 5,
          author: 'Chef Marco',
          comment: 'Perfect balance of flavors',
          createdAt: new Date('2024-01-15')
        }
      ],
      photos: []
    },
    {
      id: '2',
      name: 'Grilled Salmon with Herbs',
      description: 'Fresh Atlantic salmon with seasonal herbs and lemon',
      price: 28.00,
      category: 'main-courses',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
      isPopular: true,
      isFeatured: false,
      likes: 89,
      views: 892,
      shares: 15,
      createdBy: 'Chef Sarah',
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      status: 'published',
      tags: ['salmon', 'grilled', 'healthy', 'seafood'],
      allergens: ['fish'],
      preparationTime: 20,
      difficulty: 'easy',
      nutritionInfo: {
        calories: 420,
        protein: 35,
        carbs: 8,
        fat: 22
      },
      ingredients: ['salmon', 'herbs', 'lemon', 'olive oil'],
      instructions: [
        'Season salmon with herbs',
        'Grill for 8-10 minutes',
        'Serve with lemon'
      ],
      cost: 12.00,
      profitMargin: 57.1,
      
      // Chef Manual
      chefManual: {
        equipment: ['grill', 'fish spatula', 'brush', 'thermometer'],
        substitutions: ['trout for salmon', 'dill for herbs'],
        garnishing: 'Fresh herbs and lemon wedges',
        servingTemperature: 'hot',
        portionSizes: { small: 150, medium: 200, large: 250 },
        qualityNotes: 'Use fresh salmon, check for doneness with thermometer',
        timingNotes: 'Grill 4-5 minutes per side for medium'
      },
      
      // Waiter Manual
      waiterManual: {
        customerDescription: 'Fresh Atlantic salmon grilled to perfection with seasonal herbs',
        recommendations: ['Pair with white wine', 'Add extra lemon'],
        pairing: ['Sauvignon Blanc', 'Grilled vegetables', 'Rice pilaf'],
        specialRequests: ['Well done', 'Extra herbs', 'No lemon'],
        portionInfo: 'Standard portion, healthy option',
        alternatives: ['Baked version', 'Different fish'],
        servingTime: 3
      },
      
      // Marketing Manual
      marketingManual: {
        story: 'Fresh Atlantic salmon sourced from sustainable fisheries',
        hashtags: ['#grilledsalmon', '#healthyfood', '#seafood', '#sustainable'],
        seasonality: ['spring', 'summer'],
        targetAudience: ['health conscious', 'seafood lovers', 'dieters'],
        trends: ['healthy eating', 'sustainable seafood'],
        background: 'Sourced from certified sustainable fisheries',
        chefStory: 'Chef Sarah\'s signature healthy dish',
        localIngredients: ['local herbs', 'fresh lemon']
      },
      
      // Analytics
      analytics: {
        popularity: 72,
        profitability: 57.1,
        seasonalTrends: ['summer favorite', 'healthy choice'],
        customerRatings: 4.6,
        returnRate: 65,
        preparationEfficiency: 88
      },
      
      // Supply Chain
      supplyChain: {
        suppliers: ['Fresh Fish Co', 'Local Market'],
        minimumOrder: 5,
        deliveryTime: 1,
        storageInstructions: 'Keep refrigerated, use within 2 days',
        shelfLife: 2,
        backupSuppliers: ['Premium Seafood', 'Ocean Fresh']
      },
      
      // Financial
      financial: {
        ingredientCosts: 12.00,
        laborCosts: 4.50,
        margin: 57.1,
        pricingStrategy: 'Competitive pricing for premium seafood',
        competitorPrices: [26.00, 30.00, 32.00],
        seasonalPriceChanges: ['+10% in summer', '+5% during holidays']
      },
      
      // Sustainability
      sustainability: {
        localIngredients: ['herbs', 'lemon'],
        organicIngredients: ['organic herbs', 'organic lemon'],
        wasteReduction: 'Use fish trimmings for stock',
        carbonFootprint: 1.8,
        seasonalAvailability: ['salmon: year-round', 'herbs: spring-summer']
      },
      
      comments: [],
      ratings: [],
      photos: []
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'appetizers',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      icon: '',
      color: 'bg-blue-500',
      items: [],
      isActive: true,
      sortOrder: 1
    },
    {
      id: 'main-courses',
      name: 'Main Courses',
      description: 'Our signature main dishes',
      icon: '',
      color: 'bg-green-500',
      items: menuItems.filter(item => item.category === 'main-courses'),
      isActive: true,
      sortOrder: 2
    },
    {
      id: 'desserts',
      name: 'Desserts',
      description: 'Sweet endings to your meal',
      icon: '',
      color: 'bg-purple-500',
      items: menuItems.filter(item => item.category === 'desserts'),
      isActive: true,
      sortOrder: 3
    },
    {
      id: 'beverages',
      name: 'Beverages',
      description: 'Refreshing drinks and cocktails',
      icon: '',
      color: 'bg-orange-500',
      items: menuItems.filter(item => item.category === 'beverages'),
      isActive: true,
      sortOrder: 4
    }
  ]);

  // Persistent storage keys
  const STORAGE_KEYS = {
    MENU_ITEMS: 'mastrohub_menu_items',
    CATEGORIES: 'mastrohub_categories',
    IMPORTED_PRODUCTS: 'mastrohub_imported_products',
    IMPORT_SESSION: 'mastrohub_import_session',
    USER_PROGRESS: 'mastrohub_user_progress'
  };

  // Load data from database when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const [menuItemsData, categoriesData, importedProductsData] = await Promise.all([
        MenuMakerService.getMenuItems(user.id),
        MenuMakerService.getCategories(user.id),
        MenuMakerService.getImportedProducts(user.id)
      ]);

      // Transform database types to component types
      const transformedMenuItems: MenuItem[] = menuItemsData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price || 0,
        category: item.category_id || '',
        image: item.image_url || undefined,
        isPopular: item.is_popular,
        isFeatured: item.is_featured,
        likes: item.likes,
        views: item.views,
        shares: item.shares,
        createdBy: user.email || 'User',
        createdAt: new Date(item.created_at),
        lastModified: new Date(item.updated_at),
        status: item.status,
        tags: item.tags,
        allergens: item.allergens,
        preparationTime: item.preparation_time,
        difficulty: item.difficulty,
        ingredients: item.ingredients,
        instructions: item.instructions,
        cost: item.cost,
        profitMargin: item.profit_margin,
        comments: [],
        ratings: [],
        photos: []
      }));

      const transformedCategories: Category[] = categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        icon: cat.icon || '',
        color: cat.color || '',
        items: [],
        isActive: cat.is_active,
        sortOrder: cat.sort_order
      }));

      const transformedImportedProducts: ImportedProduct[] = importedProductsData.map(prod => ({
        id: prod.id,
        name: prod.name,
        price: prod.price || undefined,
        description: prod.description || undefined,
        category: prod.category_id || undefined,
        confidence: prod.confidence || 0,
        originalText: prod.original_text,
        isProcessed: prod.is_processed
      }));

      setMenuItems(transformedMenuItems);
      setCategories(transformedCategories);
      setImportedProducts(transformedImportedProducts);
      
      console.log('✅ Loaded user data from database');
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }, [menuItems, categories]);

  // Save import session
  useEffect(() => {
    try {
      const session = {
        importedProducts,
        timestamp: Date.now(),
        totalItems: importedProducts.length
      };
      localStorage.setItem(STORAGE_KEYS.IMPORT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('❌ Error saving import session:', error);
    }
  }, [importedProducts]);

  // Clear import session when completed
  const clearImportSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.IMPORT_SESSION);
      setImportedProducts([]);
      setShowOrganizeModal(false);
    } catch (error) {
      console.error('❌ Error clearing import session:', error);
    }
  };

  // Google Vision Import Simulation
  const simulateVisionImport = async (imageFile: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing steps
    const steps = [
      'Analyzing image...',
      'Detecting text...',
      'Extracting menu items...',
      'Processing prices...',
      'Categorizing items...',
      'Finalizing import...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingProgress(((i + 1) / steps.length) * 100);
    }
    
    // Mock imported products
    const mockImportedProducts: ImportedProduct[] = [
      {
        id: '1',
        name: 'Margherita Pizza',
        price: 16.50,
        description: 'Classic tomato and mozzarella',
        category: 'main-courses',
        confidence: 0.95,
        originalText: 'Margherita Pizza - $16.50 - Classic tomato and mozzarella',
        isProcessed: false
      },
      {
        id: '2',
        name: 'Caesar Salad',
        price: 12.00,
        description: 'Fresh romaine with caesar dressing',
        category: 'appetizers',
        confidence: 0.92,
        originalText: 'Caesar Salad - $12.00 - Fresh romaine with caesar dressing',
        isProcessed: false
      },
      {
        id: '3',
        name: 'Tiramisu',
        price: 8.50,
        description: 'Italian coffee-flavored dessert',
        category: 'desserts',
        confidence: 0.88,
        originalText: 'Tiramisu - $8.50 - Italian coffee-flavored dessert',
        isProcessed: false
      },
      {
        id: '4',
        name: 'Espresso',
        price: 3.50,
        description: 'Single shot of espresso',
        category: 'beverages',
        confidence: 0.96,
        originalText: 'Espresso - $3.50 - Single shot of espresso',
        isProcessed: false
      }
    ];
    
    setImportedProducts(mockImportedProducts);
    setIsProcessing(false);
    setShowOrganizeModal(true);
  };



  // NEW: Real Google Vision OCR
  const processImageWithVision = async (imageFile: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Step 1: Upload image to our API
      setProcessingProgress(10);
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/vision/ocr', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setProcessingProgress(50);
      
      const data = await response.json();
      
      // Check if we got an error response
      if (data.error) {
        console.warn('OCR warning:', data.error);
        // Continue with fallback data
      }
      
      const extractedTexts = data.texts || [];
      
      if (extractedTexts.length === 0) {
        throw new Error('No text was extracted from the image');
      }
      
      setProcessingProgress(80);
      
      // Step 2: Process extracted texts into menu items
      const processedProducts = extractedTexts.map((text: string, index: number) => {
        // Enhanced text parsing
        let name = text;
        let description = '';
        let price: number | undefined = undefined;
        
        // Try to extract price first
        const priceMatches = [
          /\$(\d+\.?\d*)/, // $16.50
          /€(\d+\.?\d*)/, // €16.50
          /(\d+\.?\d*)\s*€/, // 16.50 €
          /(\d+\.?\d*)\s*\$/, // 16.50 $
          /(\d+\.?\d*)\s*EUR/, // 16.50 EUR
          /(\d+\.?\d*)\s*USD/, // 16.50 USD
        ];
        
        for (const priceMatch of priceMatches) {
          const match = text.match(priceMatch);
          if (match) {
            price = parseFloat(match[1]);
            name = text.replace(match[0], '').trim();
            break;
          }
        }
        
        // Try to extract description using common separators
        const separators = [' - ', ', ', ' | ', ' / ', ' • '];
        for (const separator of separators) {
          if (name.includes(separator)) {
            const parts = name.split(separator);
            name = parts[0].trim();
            description = parts.slice(1).join(separator).trim();
            break;
          }
        }
        
        // Clean up name and description
        name = name.replace(/^[-|•\s]+|[-|•\s]+$/g, '').trim();
        description = description.replace(/^[-|•\s]+|[-|•\s]+$/g, '').trim();
        
        // Calculate confidence based on text quality and structure
        let confidence = 0.7; // Base confidence
        
        if (price) confidence += 0.1;
        if (description) confidence += 0.1;
        if (name.length > 3) confidence += 0.05;
        if (text.length > 10) confidence += 0.05;
        
        confidence = Math.min(0.95, confidence);
        
        return {
          id: `extracted-${index}`,
          name: name || `Item ${index + 1}`,
          price: price,
          description: description || '',
          category: undefined,
          confidence: confidence,
          originalText: text,
          isProcessed: false
        };
      });
      
      setProcessingProgress(100);
      setImportedProducts(processedProducts);
      setIsProcessing(false);
      setShowOrganizeModal(true);
      
    } catch (error) {
      console.error('Vision OCR error:', error);
      setIsProcessing(false);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to process image. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('No text was extracted')) {
          errorMessage = 'No text was found in the image. Please try a clearer photo of your menu.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      alert(errorMessage);
    }
  };

  // Process imported products
  const processImportedProduct = (product: ImportedProduct, category: string) => {
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: product.name,
      description: product.description || '',
      price: product.price || 0,
      category: category,
      isPopular: false,
      isFeatured: false,
      likes: 0,
      views: 0,
      shares: 0,
      createdBy: 'Chef Marco',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft',
      tags: [],
      allergens: [],
      preparationTime: 15,
      difficulty: 'medium',
      ingredients: [],
      instructions: [],
      cost: (product.price || 0) * 0.4, // Mock cost calculation
      profitMargin: 60,
      comments: [],
      ratings: [],
      photos: []
    };
    
    setMenuItems([...menuItems, newMenuItem]);
    setImportedProducts(importedProducts.filter(p => p.id !== product.id));
  };

  // Social functions
  const likeMenuItem = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const shareMenuItem = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, shares: item.shares + 1 } : item
    ));
  };

  const viewMenuItem = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, views: item.views + 1 } : item
    ));
  };

  // Create manual menu item
  const createManualItem = async () => {
    if (!user) return;
    
    if (!manualEntryForm.name || !manualEntryForm.price) {
      alert('Please fill in at least name and price');
      return;
    }

    try {
      const newMenuItem = await MenuMakerService.createMenuItem(user.id, {
        name: manualEntryForm.name,
        description: manualEntryForm.description,
        price: parseFloat(manualEntryForm.price),
        category_id: manualEntryForm.category || null,
        image_url: null,
        is_popular: false,
        is_featured: false,
        likes: 0,
        views: 0,
        shares: 0,
        status: 'published',
        tags: manualEntryForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        allergens: manualEntryForm.allergens.split(',').map(allergen => allergen.trim()).filter(allergen => allergen),
        preparation_time: parseInt(manualEntryForm.preparationTime) || 15,
        difficulty: manualEntryForm.difficulty,
        ingredients: manualEntryForm.ingredients.split(',').map(ingredient => ingredient.trim()).filter(ingredient => ingredient),
        instructions: manualEntryForm.instructions.split('\n').map(instruction => instruction.trim()).filter(instruction => instruction),
        cost: 0,
        profit_margin: 0
      });

      // Transform to component type and add to state
      const transformedItem: MenuItem = {
        id: newMenuItem.id,
        name: newMenuItem.name,
        description: newMenuItem.description || '',
        price: newMenuItem.price || 0,
        category: newMenuItem.category_id || '',
        image: newMenuItem.image_url || undefined,
        isPopular: newMenuItem.is_popular,
        isFeatured: newMenuItem.is_featured,
        likes: newMenuItem.likes,
        views: newMenuItem.views,
        shares: newMenuItem.shares,
        createdBy: user.email || 'User',
        createdAt: new Date(newMenuItem.created_at),
        lastModified: new Date(newMenuItem.updated_at),
        status: newMenuItem.status,
        tags: newMenuItem.tags,
        allergens: newMenuItem.allergens,
        preparationTime: newMenuItem.preparation_time,
        difficulty: newMenuItem.difficulty,
        ingredients: newMenuItem.ingredients,
        instructions: newMenuItem.instructions,
        cost: newMenuItem.cost,
        profitMargin: newMenuItem.profit_margin,
        comments: [],
        ratings: [],
        photos: []
      };

      setMenuItems(prev => [...prev, transformedItem]);
      setShowManualEntryModal(false);
      setManualEntryForm({
        name: '',
        description: '',
        price: '',
        category: '',
        preparationTime: '',
        difficulty: 'medium',
        tags: '',
        allergens: '',
        ingredients: '',
        instructions: ''
      });
      
      // Switch to feed view to show the new item
      setActiveView('feed');
    } catch (error) {
      console.error('Error creating menu item:', error);
      alert('Failed to create menu item');
    }
  };

  // Filter and sort
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Check if user has menu items - if not, show onboarding
  const hasMenuItems = menuItems.length > 0;
  const hasImportSession = importedProducts.length > 0;
  
  // Auto-switch to onboarding if no menu items
  useEffect(() => {
    if (!hasMenuItems && activeView !== 'onboarding') {
      setActiveView('onboarding');
    }
  }, [hasMenuItems, activeView]);

  // Auto-switch to organize after import
  useEffect(() => {
    if (importedProducts.length > 0 && !showOrganizeModal) {
      setShowOrganizeModal(true);
      setActiveView('organize');
    }
  }, [importedProducts, showOrganizeModal]);

  // Auto-switch to feed when all items are processed
  useEffect(() => {
    if (menuItems.length > 0 && importedProducts.length === 0) {
      setActiveView('feed');
    }
  }, [menuItems, importedProducts]);

  // Export menu data for sharing
  const exportMenuData = () => {
    try {
      const exportData = {
        menuItems,
        categories,
        exportDate: new Date().toISOString(),
        totalItems: menuItems.length,
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `menu-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Menu data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export menu data.');
    }
  };

  // Import menu data from file
  const importMenuData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.menuItems && data.categories) {
          setMenuItems(data.menuItems);
          setCategories(data.categories);
          alert('Menu data imported successfully!');
        } else {
          alert('Invalid menu data format.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import menu data.');
      }
    };
    reader.readAsText(file);
  };

  // Optimized sensors for better performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag & Drop state
  const [activeId, setActiveId] = useState<string | null>(null);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    console.log('🚀 Drag started:', event.active.id);
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('🎯 Drag ended:', { active: active.id, over: over?.id });
    
    if (!over) {
      console.log('❌ No drop target');
      setActiveId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    console.log('🔍 Checking drop target:', overId);
    
    // Check if dropping into a category
    const category = categories.find(cat => cat.id === overId);
    if (category) {
      console.log('✅ Dropping into category:', category.name);
      
      // Move item to category
      setImportedProducts(prev => {
        const updated = prev.map(product => 
          product.id === activeId 
            ? { ...product, category: category.id, isProcessed: true }
            : product
        );
        console.log('📦 Updated products:', updated.filter(p => p.category === category.id));
        return updated;
      });
      
      // Add to menu items
      const product = importedProducts.find(p => p.id === activeId);
      if (product) {
        console.log('➕ Adding to menu items:', product.name);
        const newMenuItem: MenuItem = {
          id: `menu-${Date.now()}`,
          name: product.name,
          description: product.description || '',
          price: product.price || 0,
          category: category.id,
          image: undefined,
          isPopular: false,
          isFeatured: false,
          likes: 0,
          views: 0,
          shares: 0,
          createdBy: 'User',
          createdAt: new Date(),
          lastModified: new Date(),
          status: 'published',
          tags: [],
          allergens: [],
          preparationTime: 15,
          difficulty: 'medium',
          ingredients: [],
          instructions: [],
          cost: 0,
          profitMargin: 0,
          comments: [],
          ratings: [],
          photos: []
        };
        
        setMenuItems(prev => [...prev, newMenuItem]);
      }
      
      setActiveId(null);
      return;
    }
    
    console.log('❌ Not a category drop target');
    
    // Original reordering logic for unorganized items
    if (activeId !== overId) {
      console.log('🔄 Reordering items');
      setImportedProducts(prev => {
        const oldIndex = prev.findIndex(item => item.id === activeId);
        const newIndex = prev.findIndex(item => item.id === overId);
        
        const newItems = [...prev];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
    
    setActiveId(null);
  };

  // Delete imported product
  const deleteImportedProduct = (productId: string) => {
    setImportedProducts(prev => prev.filter(item => item.id !== productId));
  };



  // State for combined edit/add modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ImportedProduct | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingPrice, setEditingPrice] = useState<number | undefined>(undefined);

  // Combined edit/add functionality
  const openEditModal = (product: ImportedProduct) => {
    setEditingProduct(product);
    setEditingName(product.name);
    setEditingDescription(product.description || '');
    setEditingPrice(product.price);
    setShowEditModal(true);
  };

  // Save changes and add to category
  const saveChanges = (categoryId: string) => {
    if (!editingProduct) return;

    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    // Update product name, description and price
    const updatedProduct = {
      ...editingProduct,
      name: editingName.trim(),
      description: editingDescription.trim(),
      price: editingPrice,
      category: categoryId,
      isProcessed: true
    };

    // Update imported products
    setImportedProducts(prev => prev.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    ));
    
    // Add to menu items
    const newMenuItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: editingName.trim(),
      description: editingDescription.trim(),
      price: editingPrice || 0,
      category: categoryId,
      image: undefined,
      isPopular: false,
      isFeatured: false,
      likes: 0,
      views: 0,
      shares: 0,
      createdBy: 'User',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'published',
      tags: [],
      allergens: [],
      preparationTime: 15,
      difficulty: 'medium',
      ingredients: [],
      instructions: [],
      cost: 0,
      profitMargin: 0,
      comments: [],
      ratings: [],
      photos: []
    };
    
    setMenuItems(prev => [...prev, newMenuItem]);
    setShowEditModal(false);
    setEditingProduct(null);
    setEditingName('');
    setEditingDescription('');
    setEditingPrice(undefined);
  };

  // SortableItem component with combined Edit/Add button
  const SortableItem = ({ product }: { product: ImportedProduct }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: product.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    console.log(`📦 Item ${product.name} (${product.id}): isDragging=${isDragging}`);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 cursor-grab active:cursor-grabbing ${
          isDragging 
            ? 'opacity-50 scale-95 border-blue-400 bg-blue-50/50' 
            : 'border-white/50 hover:border-slate-200 hover:shadow-lg'
        }`}
      >
        {/* Drag Handle - Always Visible */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-md flex items-center justify-center transition-colors duration-200 shadow-sm pointer-events-none">
          <GripVertical size={12} className="text-slate-600" />
        </div>

        {/* Content */}
        <div className="ml-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h6 className="font-semibold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</h6>
              {product.description && (
                <p className="text-slate-500 text-xs whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">{product.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              {product.price ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  €{product.price.toFixed(2)}
                </span>
              ) : (
                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                  No price
                </span>
              )}
            </div>
          </div>

          {/* Combined Edit/Add Button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(product);
              }}
              className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Edit & Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  // CategoryDropZone component with better drop feedback
  const CategoryDropZone = ({ category }: { category: Category }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: category.id,
    });

    const itemCount = importedProducts.filter(product => product.category === category.id).length;
    const categoryItems = importedProducts.filter(product => product.category === category.id);

    console.log(`🎯 Category ${category.name} (${category.id}): isOver=${isOver}, itemCount=${itemCount}`);

    return (
      <div 
        ref={setNodeRef}
        className={`group relative p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 cursor-pointer ${
          isOver 
            ? 'border-blue-400 bg-blue-50/50 scale-105 shadow-lg' 
            : 'border-white/50 hover:border-slate-200 hover:shadow-lg'
        }`}
        onClick={() => {
          if (itemCount > 0) {
            setSelectedCategoryForEdit(category);
            setShowCategoryItems(true);
          }
        }}
      >
        {/* Category Content */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-base whitespace-nowrap overflow-hidden text-ellipsis">{category.name}</h4>
            <p className="text-slate-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Edit & Add Button */}
            {itemCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategoryForEdit(category);
                  setShowCategoryItems(true);
                }}
                className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium"
              >
                Edit & Add
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete category "${category.name}"?`)) {
                  setCategories(prev => prev.filter(c => c.id !== category.id));
                }
              }}
              className="text-slate-400 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
              title="Delete category"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        
        {/* Drop Zone Indicator */}
        {itemCount === 0 && (
          <div className={`mt-2 text-center py-2 rounded-lg transition-all duration-200 ${
            isOver 
              ? 'bg-blue-100 text-blue-600 border border-blue-200' 
              : 'bg-slate-50 text-slate-400'
          }`}>
            <p className="text-xs font-medium">
              {isOver ? 'Drop here!' : 'Drop items here'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Tool management functions
  const handleSaveChefManual = (chefManual: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, chefManual }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveWaiterManual = (waiterManual: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, waiterManual }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveMarketingManual = (marketingManual: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, marketingManual }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveAnalytics = (analytics: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, analytics }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveSupplyChain = (supplyChain: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, supplyChain }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveFinancial = (financial: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, financial }
          : item
      ));
      setEditingTab(null);
    }
  };

  const handleSaveSustainability = (sustainability: any) => {
    if (selectedMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, sustainability }
          : item
      ));
      setEditingTab(null);
    }
  };

  const openMenuItemDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setShowMenuItemDetail(true);
    setActiveTab('chef');
    setEditingTab(null);
  };

  const closeMenuItemDetail = () => {
    setShowMenuItemDetail(false);
    setSelectedMenuItem(null);
    setEditingTab(null);
  };

  const handleAIInterviewComplete = (manuals: MenuData) => {
    // Create new menu item with AI-generated manuals
    const newMenuItem: MenuItem = {
      id: `ai-generated-${Date.now()}`,
      name: 'AI Generated Dish',
      description: 'Dish created through AI interview',
      price: 0,
      category: 'main-courses',
      image: '',
      isPopular: false,
      isFeatured: false,
      likes: 0,
      views: 0,
      shares: 0,
      createdBy: 'AI Assistant',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft',
      tags: [],
      allergens: [],
      preparationTime: 0,
      difficulty: 'medium',
      ingredients: [],
      instructions: [],
      cost: 0,
      profitMargin: 0,
      comments: [],
      ratings: [],
      photos: [],
      
      // Apply AI-generated manuals
      chefManual: manuals.chefManual,
      waiterManual: manuals.waiterManual,
      marketingManual: manuals.marketingManual,
      analytics: manuals.analytics,
      supplyChain: manuals.supplyChain,
      financial: manuals.financial,
      sustainability: manuals.sustainability
    };

    setMenuItems(prev => [newMenuItem, ...prev]);
    setShowAIInterview(false);
    
    // Open the new item for editing
    setSelectedMenuItem(newMenuItem);
    setShowMenuItemDetail(true);
  };

  const handleAIInterviewCancel = () => {
    setShowAIInterview(false);
  };

  const createRestaurantContext = (): RestaurantContext => {
    return {
      menuItems: menuItems,
      restaurantName: 'MastroHub Restaurant',
      cuisine: 'International',
      location: 'City Center',
      targetAudience: ['Business professionals', 'Food enthusiasts'],
      priceRange: 'premium',
      totalRevenue: menuItems.reduce((sum, item) => sum + (item.price * 10), 0), // Mock calculation
      averageOrderValue: menuItems.length > 0 ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length : 0,
      customerCount: menuItems.length * 50, // Mock calculation
      popularItems: menuItems.filter(item => item.isPopular).map(item => item.name),
      seasonalTrends: ['Summer salads', 'Winter comfort food'],
      availableTools: ['Menu Maker', 'QR Menu', 'Analytics', 'Marketing'],
      qrMenuEnabled: true,
      analyticsEnabled: true,
      marketingEnabled: true
    };
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Restaurant Curator</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-slate-900">Menu Social Network</h1>
                {menuItems.length > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {menuItems.length} items saved
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Navigation Tabs */}
                <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                  {['feed', 'import', 'organize', 'analytics'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view as "onboarding" | "feed" | "import" | "organize" | "analytics")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeView === view
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Bell size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Settings size={20} />
                  </button>
                  
                  {/* AI Interview Button */}
                  <button
                    onClick={() => setShowAIInterview(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Brain size={16} />
                    <span className="text-sm font-medium">AI Interview</span>
                  </button>
                  
                  {/* Removed Export/Import buttons as requested */}
                  
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ONBOARDING VIEW - First time user */}
        {activeView === 'onboarding' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              {/* Welcome Header */}
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <UtensilsCrossed size={48} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Welcome to Your Menu Social Network!
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Let's get started by importing your menu. You can either take a photo of your menu or add items manually.
                </p>
              </div>

              {/* Import Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {/* Google Vision Import - Primary Option */}
                <MotionDiv
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-white rounded-2xl shadow-xl border-2 border-blue-200 cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    setImportMethod('vision');
                    setShowImportModal(true);
                  }}
                >
                  {/* Recommended Badge */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                  
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Camera size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Import</h3>
                      <p className="text-slate-600 text-lg">
                        Take a photo of your menu and let AI extract all items automatically
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Extract prices automatically</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Detect menu categories</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">High accuracy recognition</span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>

                {/* Manual Import - Secondary Option */}
                <MotionDiv
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-white rounded-2xl shadow-xl border-2 border-slate-200 cursor-pointer"
                  onClick={() => {
                    setImportMethod('manual');
                    setShowImportModal(true);
                  }}
                >
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto">
                      <PenTool size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Manual Entry</h3>
                      <p className="text-slate-600 text-lg">
                        Add menu items manually with full control over details
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Full control over details</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Add photos and descriptions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Perfect for small menus</span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </div>

              {/* Session Recovery */}
              {importedProducts.length > 0 && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <RotateCcw size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Continue Previous Session</h4>
                        <p className="text-sm text-slate-600">
                          You have {importedProducts.length} items from a previous import session
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('organize')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue Organizing
                    </button>
                  </div>
                </MotionDiv>
              )}
            </div>
          </div>
        )}

        {/* FEED VIEW - After import */}
        {activeView === 'feed' && hasMenuItems && (
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`w-80 bg-white border-r border-slate-200 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Categories</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Category List */}
                <div className="space-y-2">
                  {/* All Items */}
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      activeCategoryFilter === 'all'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed size={16} className="text-white" />
                      </div>
                      <span className="font-medium">All Items</span>
                    </div>
                    <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {menuItems.length}
                    </span>
                  </button>
                  
                  {/* Category Items */}
                  {categories.map(category => {
                    const itemCount = menuItems.filter(item => item.category === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategoryFilter(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          activeCategoryFilter === category.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                            <span className="text-white font-bold text-sm">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {itemCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Add Category Button */}
                <button
                  onClick={() => {
                    const newCategory = prompt('Category name:');
                    if (newCategory && newCategory.trim()) {
                      setCategories(prev => [...prev, {
                        id: `cat-${Date.now()}`,
                        name: newCategory.trim(),
                        description: '',
                        icon: '',
                        color: 'bg-slate-500',
                        items: [],
                        isActive: true,
                        sortOrder: prev.length
                      }]);
                    }
                  }}
                  className="w-full mt-4 p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-all duration-200"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span className="font-medium">Add Category</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-white border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
                    >
                      <Menu size={20} />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">
                        {activeCategoryFilter === 'all' 
                          ? 'All Menu Items' 
                          : categories.find(c => c.id === activeCategoryFilter)?.name || 'Menu Items'
                        }
                      </h1>
                      <p className="text-slate-600 mt-1">
                        {sortedItems.length} items • {activeCategoryFilter === 'all' ? 'All categories' : 'Filtered'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {sortedItems.length} items
                    </span>
                    <MotionButton 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                    >
                      <Plus size={16} />
                      <span>Add Item</span>
                    </MotionButton>
                  </div>
                </div>
                
                {/* Search and Filters */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
              
              {/* Menu Items Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map(item => (
                <MotionDiv
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-slate-200 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setSelectedMenuItem(item);
                    setShowMenuItemDetail(true);
                    viewMenuItem(item.id);
                  }}
                >
                  {/* Enhanced Item Image */}
                  <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <ImageIcon size={32} className="text-blue-500" />
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      {item.isPopular && (
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          🔥 Popular
                        </div>
                      )}
                      {item.isFeatured && (
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          ⭐ Featured
                        </div>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        €{item.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openMenuItemDetail(item);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={20} className="text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            likeMenuItem(item.id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Heart size={20} className="text-red-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareMenuItem(item.id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                        >
                          <Share2 size={20} className="text-blue-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Item Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Enhanced Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Enhanced Social Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Heart size={14} className="text-red-400" />
                          <span className="font-medium">{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye size={14} className="text-blue-400" />
                          <span className="font-medium">{item.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 size={14} className="text-green-400" />
                          <span className="font-medium">{item.shares}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-slate-500">
                        <Clock size={14} className="text-amber-400" />
                        <span className="font-medium">{item.preparationTime}min</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Created by {item.createdBy}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {categories.find(c => c.id === item.category)?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </MotionDiv>
              ))}
                </div>

                {/* Empty State */}
                {sortedItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No items found</h3>
                    <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Your First Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* IMPORT VIEW - Menu import options */}
        {activeView === 'import' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              {/* Import Header */}
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <UploadIcon size={48} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Import Your Menu
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Choose how you want to add your menu items
                </p>
              </div>

              {/* Import Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {/* Google Vision Import - Primary Option */}
                <MotionDiv
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-white rounded-2xl shadow-xl border-2 border-blue-200 cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    setImportMethod('vision');
                    setShowImportModal(true);
                  }}
                >
                  {/* Recommended Badge */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                  
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Camera size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Import</h3>
                      <p className="text-slate-600 text-lg">
                        Take a photo of your menu and let AI extract all items automatically
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Extract prices automatically</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Detect menu categories</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">High accuracy recognition</span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>

                {/* Manual Import - Secondary Option */}
                <MotionDiv
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-white rounded-2xl shadow-xl border-2 border-slate-200 cursor-pointer"
                  onClick={() => {
                    setImportMethod('manual');
                    setShowImportModal(true);
                  }}
                >
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto">
                      <PenTool size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Manual Entry</h3>
                      <p className="text-slate-600 text-lg">
                        Add menu items manually with full control over details
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Full control over details</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Add photos and descriptions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-slate-700">Perfect for small menus</span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </div>

              {/* Session Recovery */}
              {importedProducts.length > 0 && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <RotateCcw size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Continue Previous Session</h4>
                        <p className="text-sm text-slate-600">
                          You have {importedProducts.length} items from a previous import session
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('organize')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue Organizing
                    </button>
                  </div>
                </MotionDiv>
              )}
            </div>
          </div>
        )}

        {/* Organize View */}
        {activeView === 'organize' && (
          <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600 font-medium">Organizing your menu</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {importedProducts.length} items to organize
                    </span>
                     <button
                       onClick={() => {
                         const newCategory = prompt('Category name:');
                         if (newCategory && newCategory.trim()) {
                           setCategories(prev => [...prev, {
                             id: `cat-${Date.now()}`,
                             name: newCategory.trim(),
                             description: '',
                             icon: '',
                             color: 'blue',
                             items: [],
                             isActive: true,
                             sortOrder: prev.length
                           }]);
                         }
                       }}
                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                     >
                       + Add Category
                     </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="max-w-7xl mx-auto px-6 py-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-12 gap-8">
                  
                  {/* Left Sidebar - Categories */}
                  <div className="col-span-4">
                    <div className="sticky top-24">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Categories</h3>
                          <p className="text-sm text-slate-500">Drag items to organize them</p>
                        </div>
                        
                        <div className="space-y-3">
                          {categories.map(category => (
                            <CategoryDropZone key={category.id} category={category} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center - Unorganized Items */}
                  <div className="col-span-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Unorganized Items</h3>
                            <p className="text-sm text-slate-500">Items waiting to be categorized</p>
                          </div>
                          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            {importedProducts.filter(p => !p.category).length} items
                          </span>
                        </div>
                      </div>

                      <SortableContext items={importedProducts.filter(p => !p.category).map(p => p.id)}>
                        <div className="grid grid-cols-1 gap-4">
                          {importedProducts
                            .filter(product => !product.category)
                            .map(product => (
                              <SortableItem key={product.id} product={product} />
                            ))}
                        </div>
                      </SortableContext>
                    </div>
                  </div>

                  {/* Right Sidebar - Actions & Analytics */}
                  <div className="col-span-3">
                    <div className="sticky top-24 space-y-6">
                      {/* Quick Actions */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => setActiveView('feed')}
                            className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                          >
                            View Feed
                          </button>
                          
                          <button
                            onClick={() => setActiveView('import')}
                            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                          >
                            Import More
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-4">Progress</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Organized</span>
                            <span className="text-lg font-bold text-green-600">
                              {importedProducts.filter(p => p.category).length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Remaining</span>
                            <span className="text-lg font-bold text-orange-600">
                              {importedProducts.filter(p => !p.category).length}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 mt-4">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(importedProducts.filter(p => p.category).length / importedProducts.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DragOverlay>
                  {activeId ? (
                    <div className="p-4 bg-white rounded-xl shadow-2xl border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-200 rounded-lg flex items-center justify-center">
                          <HashIcon size={14} className="text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-slate-900 text-sm truncate">
                            {importedProducts.find(p => p.id === activeId)?.name}
                          </h6>
                          {importedProducts.find(p => p.id === activeId)?.description && (
                            <p className="text-slate-500 text-xs truncate mt-0.5">
                              {importedProducts.find(p => p.id === activeId)?.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      <MotionAnimatePresence>
        {showImportModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowImportModal(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {importMethod === 'vision' ? 'Google Vision Import' : 'Manual Entry'}
                </h3>
                <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              {importMethod === 'vision' ? (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Camera size={40} className="text-white" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900">Upload Menu Photo</h4>
                    <p className="text-slate-600">
                      Take a clear photo of your menu and our AI will extract all items automatically
                    </p>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <UploadIcon size={48} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageWithVision(file);
                          setShowImportModal(false);
                        }
                      }}
                      className="hidden"
                      id="menu-upload"
                    />
                    <label
                      htmlFor="menu-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                      Choose Photo
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-600">
                    Add your menu items manually with full control over all details.
                  </p>
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setShowManualEntryModal(true);
                    }}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Start Manual Entry
                  </button>
                </div>
              )}
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>

      {/* Processing Modal */}
      <MotionAnimatePresence>
        {isProcessing && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 w-full max-w-md mx-4 text-center"
            >
              <div className="space-y-6">
                {/* Processing Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <MotionDiv
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Camera size={32} className="text-white" />
                  </MotionDiv>
                </div>
                
                {/* Title */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Processing Your Menu
                  </h3>
                  <p className="text-slate-600">
                    Extracting text from your menu image...
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <MotionDiv
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${processingProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    {processingProgress}% complete
                  </p>
                </div>
                
                {/* Processing Steps */}
                <div className="space-y-2 text-left">
                  <div className={`flex items-center space-x-3 text-sm ${
                    processingProgress >= 10 ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <CheckCircle size={16} />
                    <span>Uploading image</span>
                  </div>
                  <div className={`flex items-center space-x-3 text-sm ${
                    processingProgress >= 30 ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <CheckCircle size={16} />
                    <span>Analyzing with AI</span>
                  </div>
                  <div className={`flex items-center space-x-3 text-sm ${
                    processingProgress >= 60 ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <CheckCircle size={16} />
                    <span>Extracting text</span>
                  </div>
                  <div className={`flex items-center space-x-3 text-sm ${
                    processingProgress >= 90 ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <CheckCircle size={16} />
                    <span>Preparing results</span>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>

      {/* Menu Item Detail Modal */}
      <MotionAnimatePresence>
        {showMenuItemDetail && selectedMenuItem && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowMenuItemDetail(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">{selectedMenuItem.name}</h3>
                <button onClick={() => setShowMenuItemDetail(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Image */}
                {selectedMenuItem.image && (
                  <img
                    src={selectedMenuItem.image}
                    alt={selectedMenuItem.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Price</h4>
                    <p className="text-2xl font-bold text-green-600">${selectedMenuItem.price}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Preparation Time</h4>
                    <p className="text-slate-600">{selectedMenuItem.preparationTime} minutes</p>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-600">{selectedMenuItem.description}</p>
                </div>
                
                {/* Social Stats */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => likeMenuItem(selectedMenuItem.id)}
                      className="flex items-center space-x-2 text-slate-600 hover:text-red-500"
                    >
                      <Heart size={20} />
                      <span>{selectedMenuItem.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Eye size={20} />
                      <span>{selectedMenuItem.views}</span>
                    </div>
                    <button
                      onClick={() => shareMenuItem(selectedMenuItem.id)}
                      className="flex items-center space-x-2 text-slate-600 hover:text-blue-500"
                    >
                      <Share2 size={20} />
                      <span>{selectedMenuItem.shares}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">Created by</span>
                    <span className="font-medium text-slate-900">{selectedMenuItem.createdBy}</span>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>



      {/* Edit Modal */}
      <MotionAnimatePresence>
        {showEditModal && editingProduct && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Edit Item</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
                             <div className="space-y-4">
                                   <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Item Name:</label>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter item name..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description:</label>
                      <textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Enter item description..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Price (€):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingPrice || ''}
                        onChange={(e) => setEditingPrice(parseFloat(e.target.value) || undefined)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                 
                 <div className="space-y-3">
                   <h5 className="font-medium text-slate-900">Select Category:</h5>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => saveChanges(category.id)}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-semibold text-slate-900">{category.name}</h6>
                          <p className="text-slate-500 text-sm">
                            {importedProducts.filter(p => p.category === category.id).length} items
                          </p>
                        </div>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {categories.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No categories available. Create a category first.</p>
                  </div>
                )}
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>

      {/* Category Items Modal */}
      <MotionAnimatePresence>
        {showCategoryItems && selectedCategoryForEdit && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowCategoryItems(false);
              setSelectedCategoryForEdit(null);
            }}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedCategoryForEdit.name} - Items
                </h3>
                <button 
                  onClick={() => {
                    setShowCategoryItems(false);
                    setSelectedCategoryForEdit(null);
                  }} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {importedProducts
                  .filter(product => product.category === selectedCategoryForEdit.id)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        {product.description && (
                          <p className="text-slate-500 text-sm mt-1">{product.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {product.price ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            €{product.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                            No price
                          </span>
                        )}
                        
                        <button
                          onClick={() => {
                            // Move item back to unorganized
                            setImportedProducts(prev => prev.map(p => 
                              p.id === product.id ? { ...p, category: undefined } : p
                            ));
                          }}
                          className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors duration-200"
                        >
                          Move Out
                        </button>
                        
                        <button
                          onClick={() => {
                            // Edit item
                            openEditModal(product);
                            setShowCategoryItems(false);
                          }}
                          className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                
                {importedProducts.filter(product => product.category === selectedCategoryForEdit.id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No items in this category yet.</p>
                  </div>
                )}
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>

      {/* Manual Entry Modal */}
      <MotionAnimatePresence>
        {showManualEntryModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowManualEntryModal(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Add Menu Item</h3>
                <button 
                  onClick={() => setShowManualEntryModal(false)} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={manualEntryForm.name}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Truffle Pasta Carbonara"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualEntryForm.price}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="24.50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={manualEntryForm.description}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Describe your dish..."
                    rows={3}
                  />
                </div>

                {/* Category and Preparation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={manualEntryForm.category}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preparation Time (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={manualEntryForm.preparationTime}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, preparationTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                    <select
                      value={manualEntryForm.difficulty}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Tags and Allergens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={manualEntryForm.tags}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="pasta, italian, premium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Allergens (comma separated)</label>
                    <input
                      type="text"
                      value={manualEntryForm.allergens}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, allergens: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="gluten, dairy"
                    />
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={manualEntryForm.ingredients}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, ingredients: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="pasta, eggs, pancetta, parmesan"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instructions (one per line)</label>
                  <textarea
                    value={manualEntryForm.instructions}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="1. Boil pasta in salted water&#10;2. Cook pancetta until crispy&#10;3. Mix eggs with cheese"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowManualEntryModal(false)}
                    className="px-6 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createManualItem}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Item
                  </button>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </MotionAnimatePresence>
        </div>
      </div>

      {/* Jedlo Profile Modal */}
      {showMenuItemDetail && selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {selectedMenuItem.image && (
                  <img 
                    src={selectedMenuItem.image} 
                    alt={selectedMenuItem.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMenuItem.name}</h2>
                  <p className="text-gray-600">€{selectedMenuItem.price}</p>
                </div>
              </div>
              <button
                onClick={closeMenuItemDetail}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'chef', label: 'Chef Manual', icon: UtensilsCrossed },
                { id: 'waiter', label: 'Waiter Manual', icon: Users },
                { id: 'marketing', label: 'Marketing', icon: TrendingUp },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'supply', label: 'Supply Chain', icon: Package },
                { id: 'financial', label: 'Financial', icon: DollarSign },
                { id: 'sustainability', label: 'Sustainability', icon: Leaf }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'chef' && (
                <ChefTool
                  chefManual={selectedMenuItem.chefManual}
                  onSave={handleSaveChefManual}
                  isEditing={editingTab === 'chef'}
                  onEdit={() => setEditingTab('chef')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'waiter' && (
                <WaiterTool
                  waiterManual={selectedMenuItem.waiterManual}
                  onSave={handleSaveWaiterManual}
                  isEditing={editingTab === 'waiter'}
                  onEdit={() => setEditingTab('waiter')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'marketing' && (
                <MarketingTool
                  marketingManual={selectedMenuItem.marketingManual}
                  onSave={handleSaveMarketingManual}
                  isEditing={editingTab === 'marketing'}
                  onEdit={() => setEditingTab('marketing')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'analytics' && (
                <AnalyticsTool
                  analytics={selectedMenuItem.analytics}
                  onSave={handleSaveAnalytics}
                  isEditing={editingTab === 'analytics'}
                  onEdit={() => setEditingTab('analytics')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'supply' && (
                <SupplyChainTool
                  supplyChain={selectedMenuItem.supplyChain}
                  onSave={handleSaveSupplyChain}
                  isEditing={editingTab === 'supply'}
                  onEdit={() => setEditingTab('supply')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'financial' && (
                <FinancialTool
                  financial={selectedMenuItem.financial}
                  onSave={handleSaveFinancial}
                  isEditing={editingTab === 'financial'}
                  onEdit={() => setEditingTab('financial')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
              
              {activeTab === 'sustainability' && (
                <SustainabilityTool
                  sustainability={selectedMenuItem.sustainability}
                  onSave={handleSaveSustainability}
                  isEditing={editingTab === 'sustainability'}
                  onEdit={() => setEditingTab('sustainability')}
                  onCancel={() => setEditingTab(null)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* AI Interview Modal */}
      {showAIInterview && (
        <AIInterview
          onComplete={handleAIInterviewComplete}
          onCancel={handleAIInterviewCancel}
        />
      )}
      
      {/* AI Assistant Widget - Always visible */}
      <AIAssistantWidget
        restaurantContext={createRestaurantContext()}
      />
    </AuthGuard>
  );
} 