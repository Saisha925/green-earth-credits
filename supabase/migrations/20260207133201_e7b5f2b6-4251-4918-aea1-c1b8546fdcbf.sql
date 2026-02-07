
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Public read for profiles (for seller names etc)
CREATE POLICY "Anyone can read profiles"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- Create user_roles table
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Anyone can read roles (for display purposes)
CREATE POLICY "Anyone can read roles"
ON public.user_roles FOR SELECT
TO anon
USING (true);

-- Create credit_listings table
CREATE TABLE public.credit_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  registry TEXT NOT NULL,
  credits INTEGER NOT NULL,
  vintage_year INTEGER NOT NULL,
  price_per_tonne NUMERIC(10,2) NOT NULL,
  latitude NUMERIC(10,4),
  longitude NUMERIC(10,4),
  country TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'listed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_listings ENABLE ROW LEVEL SECURITY;

-- Credit listings RLS
CREATE POLICY "Anyone can view listed credits"
ON public.credit_listings FOR SELECT
USING (true);

CREATE POLICY "Sellers can create listings"
ON public.credit_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings"
ON public.credit_listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings"
ON public.credit_listings FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

-- Create retirement_records table for certificates
CREATE TABLE public.retirement_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.credit_listings(id),
  project_name TEXT NOT NULL,
  seller_name TEXT DEFAULT '',
  tonnes INTEGER NOT NULL,
  price_per_tonne NUMERIC(10,2) NOT NULL,
  credit_subtotal NUMERIC(10,2) NOT NULL,
  platform_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  platform_fee_amount NUMERIC(10,2) NOT NULL,
  total_amount_paid NUMERIC(10,2) NOT NULL,
  seller_amount NUMERIC(10,2) NOT NULL,
  beneficiary_name TEXT NOT NULL,
  message TEXT DEFAULT '',
  certificate_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.retirement_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own retirements"
ON public.retirement_records FOR SELECT
TO authenticated
USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create retirements"
ON public.retirement_records FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_esg_reports_updated_at();

-- Trigger for credit_listings updated_at
CREATE TRIGGER update_credit_listings_updated_at
BEFORE UPDATE ON public.credit_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_esg_reports_updated_at();

-- Enable realtime for credit_listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_listings;
