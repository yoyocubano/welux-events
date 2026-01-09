-- Create table for Vlog posts
CREATE TABLE IF NOT EXISTS vlog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  content_url TEXT, -- Link to full post or external content
  published_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Note: We are reusing the 'app_settings' table for simpler key-value configs
-- but for Vlog posts, a dedicated table is better for scalability.

-- Enable RLS
ALTER TABLE vlog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON vlog_posts FOR SELECT USING (true);
CREATE POLICY "Allow admin write access" ON vlog_posts FOR ALL USING (true); -- Simplified for MVP
