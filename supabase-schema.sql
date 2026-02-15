-- Restaurant Menu Display App - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: menu_items
-- Stores all menu items that can be added to daily menus
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  photo_url TEXT,
  category TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: daily_menu
-- Stores daily menu configurations (one per day)
CREATE TABLE daily_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: daily_menu_items
-- Junction table linking menu items to specific daily menus
CREATE TABLE daily_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_menu_id UUID REFERENCES daily_menu(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_chef_special BOOLEAN DEFAULT false,
  UNIQUE(daily_menu_id, menu_item_id)
);

-- Indexes for better query performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_daily_menu_date ON daily_menu(date);
CREATE INDEX idx_daily_menu_published ON daily_menu(is_published);
CREATE INDEX idx_daily_menu_items_daily_menu ON daily_menu_items(daily_menu_id);
CREATE INDEX idx_daily_menu_items_display_order ON daily_menu_items(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to published menus
-- Display app should be able to read published daily menus without authentication

-- Policy: Anyone can read published daily menus
CREATE POLICY "Public can view published daily menus"
  ON daily_menu FOR SELECT
  USING (is_published = true);

-- Policy: Anyone can read menu items that are available
CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

-- Policy: Anyone can read daily menu items for published menus
CREATE POLICY "Public can view daily menu items for published menus"
  ON daily_menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_menu
      WHERE daily_menu.id = daily_menu_items.daily_menu_id
      AND daily_menu.is_published = true
    )
  );

-- Admin policies (authenticated users can do everything)
-- These will work once we set up Supabase Auth

CREATE POLICY "Authenticated users can do everything on menu_items"
  ON menu_items FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on daily_menu"
  ON daily_menu FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on daily_menu_items"
  ON daily_menu_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Optional: Insert some sample data for testing
INSERT INTO menu_items (name, description, price, category, dietary_tags, is_available)
VALUES
  ('Truffle Risotto', 'Creamy arborio rice with black truffle and parmesan', 24.00, 'Mains', '{"Veg"}', true),
  ('Grilled Salmon', 'Atlantic salmon with lemon butter and seasonal vegetables', 28.00, 'Mains', '{}', true),
  ('Caesar Salad', 'Romaine lettuce, house-made dressing, croutons, parmesan', 12.00, 'Starters', '{"Veg"}', true),
  ('Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 18.00, 'Mains', '{"Veg"}', true),
  ('Chocolate Lava Cake', 'Warm chocolate cake with vanilla ice cream', 10.00, 'Desserts', '{"Veg"}', true),
  ('Tom Yum Soup', 'Spicy Thai soup with shrimp and lemongrass', 14.00, 'Starters', '{"Spicy"}', true),
  ('Vegan Buddha Bowl', 'Quinoa, roasted vegetables, tahini dressing', 16.00, 'Mains', '{"Vegan", "Veg"}', true);

COMMENT ON TABLE menu_items IS 'Master list of all menu items available in the restaurant';
COMMENT ON TABLE daily_menu IS 'Daily menu configurations, one record per day';
COMMENT ON TABLE daily_menu_items IS 'Links menu items to specific daily menus with ordering';
