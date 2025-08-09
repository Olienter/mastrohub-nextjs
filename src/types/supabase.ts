export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      menus: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          is_active: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          id: string
          menu_id: string
          name: string
          description: string | null
          price: number
          category: string | null
          is_available: boolean
          image_url: string | null
          allergens: Json
          nutritional_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          menu_id: string
          name: string
          description?: string | null
          price: number
          category?: string | null
          is_available?: boolean
          image_url?: string | null
          allergens?: Json
          nutritional_info?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          menu_id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string | null
          is_available?: boolean
          image_url?: string | null
          allergens?: Json
          nutritional_info?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          }
        ]
      }
      ingredients: {
        Row: {
          id: string
          name: string
          description: string | null
          unit: string | null
          cost_per_unit: number | null
          supplier: string | null
          stock_quantity: number
          min_stock_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          unit?: string | null
          cost_per_unit?: number | null
          supplier?: string | null
          stock_quantity?: number
          min_stock_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          unit?: string | null
          cost_per_unit?: number | null
          supplier?: string | null
          stock_quantity?: number
          min_stock_level?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_item_ingredients: {
        Row: {
          id: string
          menu_item_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          ingredient_id: string
          quantity: number
          unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_ingredients_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          total_amount: number
          status: string
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          total_amount: number
          status?: string
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          total_amount?: number
          status?: string
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          total_price: number
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity?: number
          unit_price: number
          total_price: number
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          special_instructions?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
