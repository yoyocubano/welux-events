-- Create the unified content items table
create table if not exists content_items (
  id uuid default gen_random_uuid() primary key,
  section text not null, -- e.g., 'vlog', 'jobs', 'deals'
  title text not null,
  subtitle text,
  description text,
  image_url text,
  link_url text,
  badge_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table content_items enable row level security;

-- Drop policy if it exists to avoid error on re-run
drop policy if exists "Public content items are viewable by everyone" on content_items;

-- Policy: Public can view items
create policy "Public content items are viewable by everyone"
  on content_items for select
  using (true);

-- Policy: Only authenticated (admins) can insert/update/delete
-- note: assuming you use the service_role key for admin ops in your functions,
-- or have an auth policy. For now, service_role bypasses RLS, so this is fine.
