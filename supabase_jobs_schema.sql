-- Create the table for job listings (Production Table: 'jobs')
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    url TEXT NOT NULL, -- The unique link to the job post
    source TEXT NOT NULL, -- e.g. 'Jooble', 'Scraper', 'Manual'
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate URLs from cluttering the DB
    CONSTRAINT unique_job_url UNIQUE (url)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can READ jobs
CREATE POLICY "Public jobs are viewable by everyone" 
ON public.jobs FOR SELECT 
USING (true);

-- Policy: Service Role (Backend) has full access
-- (Implicit in Supabase, but good to note)

-- Note: We rely on the UNIQUE constraint on 'url' to prevent duplicates 
-- during the aggregation process (handling 409 errors in Python).
