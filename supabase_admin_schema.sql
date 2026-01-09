-- Create a table to store application settings
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default values for Streaming
INSERT INTO app_settings (key, value)
VALUES 
  ('youtube_channel_id', '"UC_YOUR_CHANNEL_ID_HERE"'::jsonb),
  ('upcoming_broadcasts', '[
    {"date": "Jan 15, 18:00", "title": "Wedding Planning Q&A"}, 
    {"date": "Jan 22, 19:30", "title": "Luxembourg Venues Tour"}
  ]'::jsonb),
  ('admin_access_code', '"lux2026"'::jsonb)
  ('admin_access_code', '"lux2026"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RESET PASSWORD QUERY (Run this if you get "Invalid Code")
-- INSERT INTO app_settings (key, value) VALUES ('admin_access_code', '"lux2026"'::jsonb) ON CONFLICT (key) DO UPDATE SET value = '"lux2026"'::jsonb;

-- Enable Row Level Security (optional, depends on your auth setup)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to everyone
CREATE POLICY "Allow public read access" ON app_settings FOR SELECT USING (true);

-- Policy: Allow write access only to authenticated users (or anyone if you turn off RLS for simplicity initially)
-- For now, we will allow updating via the Service Role key in the backend.
