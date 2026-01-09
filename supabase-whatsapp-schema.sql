-- Create WhatsApp conversations table in Supabase

CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  customer_name TEXT,
  customer_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  message_sid TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better query performance
  INDEX idx_phone_number (phone_number),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_message_sid (message_sid)
);

-- Enable Row Level Security
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/select
CREATE POLICY "Service role can manage conversations"
  ON whatsapp_conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Create view for recent conversations
CREATE OR REPLACE VIEW recent_whatsapp_conversations AS
SELECT 
  phone_number,
  customer_name,
  customer_message,
  ai_response,
  created_at
FROM whatsapp_conversations
ORDER BY created_at DESC
LIMIT 100;

-- Grant access to view
GRANT SELECT ON recent_whatsapp_conversations TO service_role;
