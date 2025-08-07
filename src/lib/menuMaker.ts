import { supabase } from './supabase';
import type { Database } from './supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type ImportedProduct = Database['public']['Tables']['imported_products']['Row'];

export class MenuMakerService {
  // Test data for development
  private static getTestData(userId: string) {
    if (userId === 'test-admin-id') {
      return {
        menuItems: [
          {
            id: 'test-item-1',
            user_id: userId,
            name: 'Truffle Pasta Carbonara',
            description: 'Creamy pasta with black truffle, pancetta, and parmesan',
            price: 24.50,
            category_id: 'test-category-1',
            image_url: null,
            is_popular: true,
            is_featured: true,
            likes: 156,
            views: 1247,
            shares: 23,
            status: 'published',
            tags: ['pasta', 'truffle', 'italian', 'premium'],
            allergens: ['gluten', 'dairy'],
            preparation_time: 15,
            difficulty: 'medium',
            ingredients: ['pasta', 'eggs', 'pancetta', 'parmesan', 'truffle'],
            instructions: ['Boil pasta in salted water', 'Cook pancetta until crispy', 'Mix eggs with cheese', 'Combine all ingredients'],
            cost: 8.50,
            profit_margin: 65.3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'test-item-2',
            user_id: userId,
            name: 'Grilled Salmon with Herbs',
            description: 'Fresh Atlantic salmon with seasonal herbs and lemon',
            price: 28.00,
            category_id: 'test-category-1',
            image_url: null,
            is_popular: true,
            is_featured: false,
            likes: 89,
            views: 892,
            shares: 15,
            status: 'published',
            tags: ['salmon', 'grilled', 'healthy', 'seafood'],
            allergens: ['fish'],
            preparation_time: 20,
            difficulty: 'easy',
            ingredients: ['salmon', 'herbs', 'lemon', 'olive oil'],
            instructions: ['Season salmon', 'Grill until cooked', 'Add herbs and lemon'],
            cost: 12.00,
            profit_margin: 57.1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        categories: [
          {
            id: 'test-category-1',
            user_id: userId,
            name: 'Main Courses',
            description: 'Primary dishes and entrees',
            icon: '🍽️',
            color: '#3B82F6',
            sort_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'test-category-2',
            user_id: userId,
            name: 'Appetizers',
            description: 'Starters and small plates',
            icon: '🥗',
            color: '#10B981',
            sort_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        importedProducts: []
      };
    }
    return { menuItems: [], categories: [], importedProducts: [] };
  }

  // Menu Items
  static async getMenuItems(userId: string): Promise<MenuItem[]> {
    // Return test data for development
    if (userId === 'test-admin-id') {
      return this.getTestData(userId).menuItems;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createMenuItem(userId: string, item: Omit<MenuItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ ...item, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Categories
  static async getCategories(userId: string): Promise<MenuCategory[]> {
    // Return test data for development
    if (userId === 'test-admin-id') {
      return this.getTestData(userId).categories;
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createCategory(userId: string, category: Omit<MenuCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ ...category, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Imported Products
  static async getImportedProducts(userId: string): Promise<ImportedProduct[]> {
    // Return test data for development
    if (userId === 'test-admin-id') {
      return this.getTestData(userId).importedProducts;
    }

    const { data, error } = await supabase
      .from('imported_products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createImportedProduct(userId: string, product: Omit<ImportedProduct, 'id' | 'user_id' | 'created_at'>): Promise<ImportedProduct> {
    const { data, error } = await supabase
      .from('imported_products')
      .insert({ ...product, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateImportedProduct(id: string, updates: Partial<ImportedProduct>): Promise<ImportedProduct> {
    const { data, error } = await supabase
      .from('imported_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteImportedProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('imported_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Bulk operations
  static async createImportedProducts(userId: string, products: Omit<ImportedProduct, 'id' | 'user_id' | 'created_at'>[]): Promise<ImportedProduct[]> {
    const { data, error } = await supabase
      .from('imported_products')
      .insert(products.map(product => ({ ...product, user_id: userId })))
      .select();

    if (error) throw error;
    return data || [];
  }

  // Social functions
  static async likeMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ likes: supabase.sql`likes + 1` })
      .eq('id', id);

    if (error) throw error;
  }

  static async viewMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', id);

    if (error) throw error;
  }

  static async shareMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ shares: supabase.sql`shares + 1` })
      .eq('id', id);

    if (error) throw error;
  }
}
