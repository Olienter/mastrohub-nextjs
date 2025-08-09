-- 0002_policies.sql - Overnight bootstrap RLS policies
-- Profiles policies
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Menus policies
create policy "menus_owner_full_access"
  on public.menus for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Menu items policies
create policy "menu_items_owner_full_access"
  on public.menu_items for all
  using (
    exists (
      select 1 from public.menus
      where menus.id = menu_items.menu_id
      and menus.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.menus
      where menus.id = menu_items.menu_id
      and menus.owner_id = auth.uid()
    )
  );

-- Ingredients policies
create policy "ingredients_owner_full_access"
  on public.ingredients for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Menu item ingredients policies
create policy "menu_item_ingredients_owner_access"
  on public.menu_item_ingredients for all
  using (
    exists (
      select 1 from public.menu_items mi
      join public.menus m on m.id = mi.menu_id
      where mi.id = menu_item_ingredients.menu_item_id
      and m.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.menu_items mi
      join public.menus m on m.id = mi.menu_id
      where mi.id = menu_item_ingredients.menu_item_id
      and m.owner_id = auth.uid()
    )
  );

-- Orders policies
create policy "orders_owner_full_access"
  on public.orders for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Order items policies
create policy "order_items_owner_access"
  on public.order_items for all
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and auth.uid() is not null
    )
  )
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and auth.uid() is not null
    )
  );

-- Public read access for active menus (for QR menu display)
create policy "menus_public_read_active"
  on public.menus for select
  using (is_active = true);

create policy "menu_items_public_read_active"
  on public.menu_items for select
  using (
    is_available = true
    and exists (
      select 1 from public.menus
      where menus.id = menu_items.menu_id
      and menus.is_active = true
    )
  );
