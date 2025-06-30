/*
  # Create E-LIFE SOCIETY Registration System Schema

  1. New Tables
    - `panchayaths` - Store panchayath and district information
    - `categories` - Store registration categories with fees and descriptions  
    - `registrations` - Store user registration applications
    - `admins` - Store admin user credentials and roles

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to panchayaths and categories
    - Add policies for registration submissions and admin access

  3. Sample Data
    - Insert sample panchayaths across Kerala districts
    - Insert sample categories for self-employment programs
    - Insert admin users with different role levels
*/

-- Create panchayaths table
CREATE TABLE IF NOT EXISTS panchayaths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, district)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'panchayaths' AND policyname = 'Anyone can read panchayaths'
  ) THEN
    CREATE POLICY "Anyone can read panchayaths"
      ON panchayaths
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create policies for categories (public read access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Anyone can read categories'
  ) THEN
    CREATE POLICY "Anyone can read categories"
      ON categories
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create policies for registrations (public insert and read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Anyone can insert registrations'
  ) THEN
    CREATE POLICY "Anyone can insert registrations"
      ON registrations
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Anyone can read registrations'
  ) THEN
    CREATE POLICY "Anyone can read registrations"
      ON registrations
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Anyone can update registrations'
  ) THEN
    CREATE POLICY "Anyone can update registrations"
      ON registrations
      FOR UPDATE
      TO public
      USING (true);
  END IF;
END $$;

-- Create policies for admins (public read access for login)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Anyone can read admins'
  ) THEN
    CREATE POLICY "Anyone can read admins"
      ON admins
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Insert sample panchayaths
INSERT INTO panchayaths (name, district) VALUES
  ('Amarambalam', 'Malappuram'),
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

-- Insert sample categories based on your requirements
INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) VALUES
  ('Pennyekart Free Registration', 'Totally free registration with basic level delivery service between 2pm to 6pm', 500, 0, true),
  ('Pennyekart Paid Registration', 'Premium registration with any time delivery between 8am to 7pm', 1000, 500, true),
  ('FarmeLife', 'Connected with dairy farm, poultry farm and agricultural businesses', 2000, 1000, true),
  ('OrganeLife', 'Connected with vegetable and house gardening, especially terrace vegetable farming', 1500, 750, true),
  ('FoodeLife', 'Connected with food processing business and food-related enterprises', 1800, 900, true),
  ('EntreLife', 'Connected with skilled projects like stitching, art works, various home services', 1200, 600, true),
  ('Job Card', 'Special offer card for first-time registrants with investment benefits and convertible to any category', 3000, 1500, true)
ON CONFLICT (name) DO NOTHING;

-- Insert admin users
INSERT INTO admins (username, password, role) VALUES
  ('evaadmin', 'eva919123', 'super_admin'),
  ('admin1', 'elife9094', 'local_admin'),
  ('admin2', 'penny9094', 'user_admin')
ON CONFLICT (username) DO NOTHING;

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