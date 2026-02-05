-- Issue 3: ESG Database Security Fix

-- Step 1: Add user_id column (defaults to null for existing records, will require auth for new)
ALTER TABLE public.esg_reports
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Remove insecure public policy
DROP POLICY IF EXISTS "Allow public access to ESG reports" ON public.esg_reports;

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;

-- Step 4: Create secure RLS policies

-- Users can read their own ESG reports
CREATE POLICY "Users can read own ESG reports"
ON public.esg_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own ESG reports
CREATE POLICY "Users can create own ESG reports"
ON public.esg_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own ESG reports
CREATE POLICY "Users can update own ESG reports"
ON public.esg_reports
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own ESG reports
CREATE POLICY "Users can delete own ESG reports"
ON public.esg_reports
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Also allow anonymous read for demo purposes (but not write)
CREATE POLICY "Allow anonymous read for demo"
ON public.esg_reports
FOR SELECT
TO anon
USING (user_id IS NULL);