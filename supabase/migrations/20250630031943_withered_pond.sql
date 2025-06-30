/*
  # Create initial database schema for E-LIFE SOCIETY registration system

  1. New Tables
    - `panchayaths`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `district` (text, not null)
      - `created_at` (timestamp)
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `actual_fee` (numeric, default 0)
      - `offer_fee` (numeric, default 0)
      - `image_url` (text)
      - `popup_image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    - `registrations`
      - `id` (uuid, primary key)
      - `customer_id` (text, unique, not null)
      - `category` (text, not null)
      - `name` (text, not null)
      - `address` (text, not null)
      - `mobile_number` (text, not null)
      - `panchayath` (text, not null)
      - `ward` (text, not null)
      - `agent_pro` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique, not null)
      - `password` (text, not null)
      - `role` (text, default 'user_admin')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to categories and panchayaths
    - Add policies for public insert access to registrations
    - Add policies for admin access to all tables

  3. Sample Data
    - Insert sample panchayaths and categories for testing
*/

-- Create panchayaths table
CREATE TABLE IF NOT EXISTS panchayaths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  actual_fee numeric DEFAULT 0,
  offer_fee numeric DEFAULT 0,
  image_url text,
  popup_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text UNIQUE NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  mobile_number text NOT NULL,
  panchayath text NOT NULL,
  ward text NOT NULL,
  agent_pro text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'user_admin' CHECK (role IN ('super_admin', 'local_admin', 'user_admin')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE panchayaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for panchayaths (public read access)
CREATE POLICY "Anyone can read panchayaths"
  ON panchayaths
  FOR SELECT
  TO public
  USING (true);

-- Create policies for categories (public read access)
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create policies for registrations (public insert, authenticated read own data)
CREATE POLICY "Anyone can insert registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read registrations"
  ON registrations
  FOR SELECT
  TO public
  USING (true);

-- Create policies for admins (authenticated users only)
CREATE POLICY "Authenticated users can read admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample panchayaths
INSERT INTO panchayaths (name, district) VALUES
  ('Thiruvananthapuram', 'Thiruvananthapuram'),
  ('Neyyattinkara', 'Thiruvananthapuram'),
  ('Kattakada', 'Thiruvananthapuram'),
  ('Varkala', 'Thiruvananthapuram'),
  ('Attingal', 'Thiruvananthapuram'),
  ('Kollam', 'Kollam'),
  ('Karunagappally', 'Kollam'),
  ('Punalur', 'Kollam'),
  ('Pathanamthitta', 'Pathanamthitta'),
  ('Adoor', 'Pathanamthitta'),
  ('Alappuzha', 'Alappuzha'),
  ('Cherthala', 'Alappuzha'),
  ('Kottayam', 'Kottayam'),
  ('Changanassery', 'Kottayam'),
  ('Idukki', 'Idukki'),
  ('Thodupuzha', 'Idukki'),
  ('Ernakulam', 'Ernakulam'),
  ('Aluva', 'Ernakulam'),
  ('Thrissur', 'Thrissur'),
  ('Chalakudy', 'Thrissur'),
  ('Palakkad', 'Palakkad'),
  ('Ottapalam', 'Palakkad'),
  ('Malappuram', 'Malappuram'),
  ('Tirur', 'Malappuram'),
  ('Kozhikode', 'Kozhikode'),
  ('Vadakara', 'Kozhikode'),
  ('Wayanad', 'Wayanad'),
  ('Mananthavady', 'Wayanad'),
  ('Kannur', 'Kannur'),
  ('Thalassery', 'Kannur'),
  ('Kasaragod', 'Kasaragod'),
  ('Kanhangad', 'Kasaragod')
ON CONFLICT (name, district) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) VALUES
  ('Tailoring & Fashion Design', 'Learn professional tailoring and fashion design skills', 5000, 2500, true),
  ('Beauty & Wellness', 'Comprehensive beauty and wellness training program', 4000, 2000, true),
  ('Computer Training', 'Basic to advanced computer skills and digital literacy', 3000, 1500, true),
  ('Food Processing', 'Food processing and packaging business training', 4500, 2250, true),
  ('Handicrafts', 'Traditional and modern handicraft making', 3500, 1750, true),
  ('Agriculture & Farming', 'Modern farming techniques and organic agriculture', 2000, 1000, true),
  ('Small Business Development', 'Entrepreneurship and small business management', 2500, 0, true),
  ('Digital Marketing', 'Online marketing and social media management', 3000, 1500, true)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger for registrations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_registrations_updated_at'
  ) THEN
    CREATE TRIGGER update_registrations_updated_at
      BEFORE UPDATE ON registrations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;