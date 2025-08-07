import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          read_time: string;
          author: string;
          author_title?: string;
          author_avatar?: string;
          published_at: string;
          status: 'draft' | 'published' | 'pending';
          featured: boolean;
          tags: string[];
          view_count: number;
          like_count: number;
          fact_checked: boolean;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          read_time: string;
          author: string;
          author_title?: string;
          author_avatar?: string;
          published_at: string;
          status?: 'draft' | 'published' | 'pending';
          featured?: boolean;
          tags?: string[];
          view_count?: number;
          like_count?: number;
          fact_checked?: boolean;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          image?: string;
          category?: string;
          read_time?: string;
          author?: string;
          author_title?: string;
          author_avatar?: string;
          published_at?: string;
          status?: 'draft' | 'published' | 'pending';
          featured?: boolean;
          tags?: string[];
          view_count?: number;
          like_count?: number;
          fact_checked?: boolean;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status: 'free' | 'premium';
          subscription_expires?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role?: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status?: 'free' | 'premium';
          subscription_expires?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role?: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status?: 'free' | 'premium';
          subscription_expires?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          icon?: string;
          color?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          price: number | null;
          category_id: string | null;
          image_url: string | null;
          is_popular: boolean;
          is_featured: boolean;
          likes: number;
          views: number;
          shares: number;
          status: 'draft' | 'published' | 'archived';
          tags: string[];
          allergens: string[];
          preparation_time: number;
          difficulty: 'easy' | 'medium' | 'hard';
          ingredients: string[];
          instructions: string[];
          cost: number;
          profit_margin: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          price?: number;
          category_id?: string;
          image_url?: string;
          is_popular?: boolean;
          is_featured?: boolean;
          likes?: number;
          views?: number;
          shares?: number;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
          allergens?: string[];
          preparation_time?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          ingredients?: string[];
          instructions?: string[];
          cost?: number;
          profit_margin?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          image_url?: string;
          is_popular?: boolean;
          is_featured?: boolean;
          likes?: number;
          views?: number;
          shares?: number;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
          allergens?: string[];
          preparation_time?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          ingredients?: string[];
          instructions?: string[];
          cost?: number;
          profit_margin?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      imported_products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          price: number | null;
          description: string | null;
          category_id: string | null;
          confidence: number | null;
          original_text: string;
          is_processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          price?: number;
          description?: string;
          category_id?: string;
          confidence?: number;
          original_text: string;
          is_processed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          price?: number;
          description?: string;
          category_id?: string;
          confidence?: number;
          original_text?: string;
          is_processed?: boolean;
          created_at?: string;
        };
      };
    };
  };
} 