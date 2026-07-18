-- ─── SUPABASE MIGRATION SCRIPT FOR AGRIPRICE (Grains Only) ───────────────────────
-- Run this script in the Supabase SQL Editor to initialize the database schema

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  language text DEFAULT 'en',
  home_mandi_id uuid,
  district text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mandis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  lat numeric,
  lng numeric
);

CREATE TABLE IF NOT EXISTS public.commodities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_hi text,
  name_kn text,
  unit text DEFAULT 'quintal',
  category text DEFAULT 'Grains',
  emoji text
);

CREATE TABLE IF NOT EXISTS public.prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id uuid REFERENCES public.commodities(id) ON DELETE CASCADE,
  mandi_id uuid REFERENCES public.mandis(id) ON DELETE CASCADE,
  price numeric NOT NULL,
  unit text DEFAULT 'quintal',
  date date DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  commodity_id uuid REFERENCES public.commodities(id) ON DELETE CASCADE,
  mandi_id uuid REFERENCES public.mandis(id) ON DELETE SET NULL,
  threshold_price numeric NOT NULL,
  alert_type text CHECK (alert_type IN ('above', 'below')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  reply text,
  language text,
  is_user boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public Data: Mandis, Commodities, Prices are readable by all authenticated users
CREATE POLICY "Public read mandis" ON public.mandis FOR SELECT USING (true);
CREATE POLICY "Public read commodities" ON public.commodities FOR SELECT USING (true);
CREATE POLICY "Public read prices" ON public.prices FOR SELECT USING (true);

-- Alerts & Chat: Users can only see/manage their own records
CREATE POLICY "Users manage own alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own chat" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- 3. Create Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Insert Seed Data (Mandis)
INSERT INTO public.mandis (id, name, district, state, lat, lng) VALUES
  ('11111111-a1b2-c3d4-e5f6-000000000001', 'Hubballi APMC', 'Dharwad', 'Karnataka', 15.3647, 75.1240),
  ('11111111-a1b2-c3d4-e5f6-000000000002', 'Yeshwanthpur APMC', 'Bangalore', 'Karnataka', 13.0285, 77.5409),
  ('11111111-a1b2-c3d4-e5f6-000000000003', 'Mysuru APMC', 'Mysuru', 'Karnataka', 12.2958, 76.6394),
  ('11111111-a1b2-c3d4-e5f6-000000000004', 'Raichur APMC', 'Raichur', 'Karnataka', 16.2008, 77.3623),
  ('11111111-a1b2-c3d4-e5f6-000000000005', 'Pune APMC (Reference)', 'Pune', 'Maharashtra', 18.5089, 73.9259),
  ('11111111-a1b2-c3d4-e5f6-000000000006', 'Karnal APMC (Reference)', 'Karnal', 'Haryana', 29.6857, 76.9905),
  ('11111111-a1b2-c3d4-e5f6-000000000007', 'Ludhiana APMC', 'Ludhiana', 'Punjab', 30.9010, 75.8573),
  ('11111111-a1b2-c3d4-e5f6-000000000008', 'Lucknow APMC', 'Lucknow', 'Uttar Pradesh', 26.8467, 80.9462),
  ('11111111-a1b2-c3d4-e5f6-000000000009', 'Indore APMC', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Seed Data (Commodities - Grains Only)
INSERT INTO public.commodities (id, name, name_hi, name_kn, category, emoji) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Wheat', 'गेहूं', 'ಗೋಧಿ', 'Grains', '🌾'),
  ('22222222-2222-2222-2222-222222222222', 'Rice (Paddy)', 'धान (चावल)', 'ಭತ್ತ (ಅಕ್ಕಿ)', 'Grains', '🍚'),
  ('33333333-3333-3333-3333-333333333333', 'Maize (Corn)', 'मक्का', 'ಮೆಕ್ಕೆಜೋಳ', 'Grains', '🌽'),
  ('44444444-4444-4444-4444-444444444444', 'Bajra', 'बाजरा', 'ಸಜ್ಜೆ', 'Grains', '🌾'),
  ('55555555-5555-5555-5555-555555555555', 'Jowar', 'ज्वार', 'ಜೋಳ', 'Grains', '🌾'),
  ('66666666-6666-6666-6666-666666666666', 'Barley', 'जौ', 'ಬಾರ್ಲಿ', 'Grains', '🌾')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Seed Data (Prices for Today)
INSERT INTO public.prices (commodity_id, mandi_id, price) VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-a1b2-c3d4-e5f6-000000000001', 2350),
  ('11111111-1111-1111-1111-111111111111', '11111111-a1b2-c3d4-e5f6-000000000002', 2400),
  ('22222222-2222-2222-2222-222222222222', '11111111-a1b2-c3d4-e5f6-000000000001', 2950),
  ('33333333-3333-3333-3333-333333333333', '11111111-a1b2-c3d4-e5f6-000000000003', 2080)
ON CONFLICT DO NOTHING;
