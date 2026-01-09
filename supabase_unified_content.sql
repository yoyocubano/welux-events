-- Create a unified table for all dynamic content sections
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- 'jobs', 'deals', 'relocation', 'services', 'tips', 'nightlife'
  title TEXT NOT NULL,
  subtitle TEXT,         -- Used for: Company Name, Job Type, Partner Name
  description TEXT,      -- Used for: Location, Details, Long text
  image_url TEXT,
  link_url TEXT,
  badge_text TEXT,       -- Used for: Discount %, "Urgent", "New"
  order_rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read content" ON content_items FOR SELECT USING (true);

-- Allow full access to admins/service role (simplified for now, assuming service role usage in API)
-- CREATE POLICY "Admin full access" ON content_items USING (true) WITH CHECK (true);

-- Insert some initial sample data so the sections aren't empty
INSERT INTO content_items (section, title, subtitle, description, badge_text, link_url)
VALUES 
('jobs', 'Event Project Manager', 'Contract', 'Luxembourg City / Remote', 'Posted on Moovijob', '#'),
('deals', 'Bridal Spa Day', 'Mondorf Domaine Thermal', 'Relaxing spa day for groups.', '15% OFF', 'https://mondorf.lu');
