-- Create a MASTER SECURITY CODE for top-level security actions (like changing the password)
-- This prevents regular admins from hijacking the account.

INSERT INTO app_settings (key, value)
VALUES ('master_security_code', '"lux_master_2026"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Ensure the admin_access_code exists
INSERT INTO app_settings (key, value)
VALUES ('admin_access_code', '"lux2026"'::jsonb)
ON CONFLICT (key) DO NOTHING;
