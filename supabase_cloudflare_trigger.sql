-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to call the Cloudflare Revalidation Endpoint
CREATE OR REPLACE FUNCTION public.trigger_revalidate_jobs()
RETURNS trigger AS $$
BEGIN
  -- Call the WeLux Events API endpoint to purge cache
  -- This request is asynchronous and won't block the database operation
  PERFORM net.http_post(
      url := 'https://weluxevents.com/api/revalidate-jobs',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := '{}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to fire on any change to the 'jobs' table
DROP TRIGGER IF EXISTS on_jobs_change ON public.jobs;

CREATE TRIGGER on_jobs_change
AFTER INSERT OR UPDATE OR DELETE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.trigger_revalidate_jobs();

-- Optional: Run it once to test
-- SELECT net.http_post(url := 'https://weluxevents.com/api/revalidate-jobs');
