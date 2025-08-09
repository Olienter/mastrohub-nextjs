-- 0001_base.sql - Overnight bootstrap base schema
-- Enable required extensions
create extension if not exists "pgcrypto";

-- Profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'user',
  preferences jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Menus table
create table public.menus (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  settings jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on menus
alter table public.menus enable row level security;

-- Menu items table
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text,
  is_available boolean default true,
  image_url text,
  allergens jsonb default '[]',
  nutritional_info jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on menu_items
alter table public.menu_items enable row level security;

-- Ingredients table
create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  unit text,
  cost_per_unit decimal(10,2),
  supplier text,
  stock_quantity decimal(10,2) default 0,
  min_stock_level decimal(10,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on ingredients
alter table public.ingredients enable row level security;

-- Menu item ingredients (many-to-many)
create table public.menu_item_ingredients (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  quantity decimal(10,3) not null,
  unit text,
  created_at timestamptz not null default now(),
  unique(menu_item_id, ingredient_id)
);

-- Enable RLS on menu_item_ingredients
alter table public.menu_item_ingredients enable row level security;

-- Orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  customer_phone text,
  total_amount decimal(10,2) not null,
  status text not null default 'pending',
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Order items table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  quantity integer not null default 1,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  special_instructions text,
  created_at timestamptz not null default now()
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Create indexes for better performance
create index idx_profiles_email on public.profiles(email);
create index idx_menus_owner_id on public.menus(owner_id);
create index idx_menu_items_menu_id on public.menu_items(menu_id);
create index idx_menu_items_category on public.menu_items(category);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_ingredients_name on public.ingredients(name);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_menus_updated_at
  before update on public.menus
  for each row
  execute function public.handle_updated_at();

create trigger handle_menu_items_updated_at
  before update on public.menu_items
  for each row
  execute function public.handle_updated_at();

create trigger handle_ingredients_updated_at
  before update on public.ingredients
  for each row
  execute function public.handle_updated_at();

create trigger handle_orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();
