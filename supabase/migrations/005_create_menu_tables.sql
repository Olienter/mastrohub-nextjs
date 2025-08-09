-- Create menu categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  allergens TEXT[],
  preparation_time INTEGER, -- in minutes
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu item tags table
CREATE TABLE IF NOT EXISTS menu_item_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu item manuals table
CREATE TABLE IF NOT EXISTS menu_item_manuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  manual_type VARCHAR(50) NOT NULL CHECK (manual_type IN ('chef', 'waiter', 'marketing', 'analytics', 'supply_chain', 'financial', 'sustainability')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  qr_data TEXT NOT NULL,
  qr_image_url TEXT,
  settings JSONB DEFAULT '{}',
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_workspace_id ON menu_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_workspace_id ON menu_categories(workspace_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_tags_menu_item_id ON menu_item_tags(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_manuals_menu_item_id ON menu_item_manuals(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_manuals_type ON menu_item_manuals(manual_type);
CREATE INDEX IF NOT EXISTS idx_qr_codes_workspace_id ON qr_codes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_menu_item_id ON qr_codes(menu_item_id);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Menu categories policies
CREATE POLICY "Users can view their own workspace menu categories" ON menu_categories
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workspace menu categories" ON menu_categories
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workspace menu categories" ON menu_categories
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workspace menu categories" ON menu_categories
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Menu items policies
CREATE POLICY "Users can view their own workspace menu items" ON menu_items
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workspace menu items" ON menu_items
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workspace menu items" ON menu_items
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workspace menu items" ON menu_items
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Menu item tags policies
CREATE POLICY "Users can view their own workspace menu item tags" ON menu_item_tags
  FOR SELECT USING (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workspace menu item tags" ON menu_item_tags
  FOR INSERT WITH CHECK (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workspace menu item tags" ON menu_item_tags
  FOR DELETE USING (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

-- Menu item manuals policies
CREATE POLICY "Users can view their own workspace menu item manuals" ON menu_item_manuals
  FOR SELECT USING (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workspace menu item manuals" ON menu_item_manuals
  FOR INSERT WITH CHECK (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workspace menu item manuals" ON menu_item_manuals
  FOR UPDATE USING (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workspace menu item manuals" ON menu_item_manuals
  FOR DELETE USING (
    menu_item_id IN (
      SELECT mi.id FROM menu_items mi 
      JOIN workspaces w ON mi.workspace_id = w.id 
      WHERE w.user_id = auth.uid()
    )
  );

-- QR codes policies
CREATE POLICY "Users can view their own workspace QR codes" ON qr_codes
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workspace QR codes" ON qr_codes
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workspace QR codes" ON qr_codes
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workspace QR codes" ON qr_codes
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_item_manuals_updated_at BEFORE UPDATE ON menu_item_manuals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
