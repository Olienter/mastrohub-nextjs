-- Menu Maker tables with user-specific data
-- Migration: 004_menu_maker_schema.sql

-- Create menu_categories table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  preparation_time INTEGER DEFAULT 15,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ingredients TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  cost DECIMAL(10,2) DEFAULT 0,
  profit_margin DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create imported_products table
CREATE TABLE imported_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  confidence DECIMAL(5,2),
  original_text TEXT,
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_categories
CREATE POLICY "Users can view own categories" ON menu_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON menu_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON menu_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON menu_categories
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for menu_items
CREATE POLICY "Users can view own menu items" ON menu_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own menu items" ON menu_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own menu items" ON menu_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own menu items" ON menu_items
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for imported_products
CREATE POLICY "Users can view own imported products" ON imported_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imported products" ON imported_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own imported products" ON imported_products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own imported products" ON imported_products
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_menu_categories_user_id ON menu_categories(user_id);
CREATE INDEX idx_menu_items_user_id ON menu_items(user_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_imported_products_user_id ON imported_products(user_id);
CREATE INDEX idx_imported_products_category_id ON imported_products(category_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_menu_categories_updated_at 
  BEFORE UPDATE ON menu_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
  BEFORE UPDATE ON menu_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
