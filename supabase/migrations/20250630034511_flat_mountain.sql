/*
  # E-LIFE SOCIETY Database Schema

  1. New Tables
    - `panchayaths` - Store panchayath/district information
    - `categories` - Store registration categories with fees
    - `registrations` - Store user registrations
    - `admins` - Store admin user accounts

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on panchayaths and categories
    - Add policies for public insert/read/update on registrations
    - Add policies for public read access on admins (for login)

  3. Sample Data
    - Insert Kerala panchayaths and districts
    - Insert registration categories with fees
    - Insert admin users with different roles
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
  customer_id text NOT NULL,
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
  username text NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'user_admin' CHECK (role IN ('super_admin', 'local_admin', 'user_admin')),
  created_at timestamptz DEFAULT now()
);

-- Clean up any existing duplicate data before adding constraints
DO $$
BEGIN
  -- Remove duplicate panchayaths, keeping only the first occurrence
  DELETE FROM panchayaths a USING panchayaths b 
  WHERE a.id > b.id AND a.name = b.name AND a.district = b.district;
  
  -- Remove duplicate categories, keeping only the first occurrence
  DELETE FROM categories a USING categories b 
  WHERE a.id > b.id AND a.name = b.name;
  
  -- Remove duplicate registrations, keeping only the first occurrence
  DELETE FROM registrations a USING registrations b 
  WHERE a.id > b.id AND a.customer_id = b.customer_id;
  
  -- Remove duplicate admins, keeping only the first occurrence
  DELETE FROM admins a USING admins b 
  WHERE a.id > b.id AND a.username = b.username;
END $$;

-- Add unique constraints after cleaning duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'panchayaths_name_district_key'
  ) THEN
    ALTER TABLE panchayaths ADD CONSTRAINT panchayaths_name_district_key UNIQUE(name, district);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'categories_name_key'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE(name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registrations_customer_id_key'
  ) THEN
    ALTER TABLE registrations ADD CONSTRAINT registrations_customer_id_key UNIQUE(customer_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admins_username_key'
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_username_key UNIQUE(username);
  END IF;
END $$;

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

-- Insert sample panchayaths (using individual INSERT statements to avoid conflicts)
DO $$
BEGIN
  -- Insert Amarambalam first as specified
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Amarambalam' AND district = 'Malappuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Amarambalam', 'Malappuram');
  END IF;
  
  -- Insert other panchayaths
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Thiruvananthapuram' AND district = 'Thiruvananthapuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Thiruvananthapuram', 'Thiruvananthapuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Neyyattinkara' AND district = 'Thiruvananthapuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Neyyattinkara', 'Thiruvananthapuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kattakada' AND district = 'Thiruvananthapuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kattakada', 'Thiruvananthapuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Varkala' AND district = 'Thiruvananthapuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Varkala', 'Thiruvananthapuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Attingal' AND district = 'Thiruvananthapuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Attingal', 'Thiruvananthapuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kollam' AND district = 'Kollam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kollam', 'Kollam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Karunagappally' AND district = 'Kollam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Karunagappally', 'Kollam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Punalur' AND district = 'Kollam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Punalur', 'Kollam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Pathanamthitta' AND district = 'Pathanamthitta') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Pathanamthitta', 'Pathanamthitta');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Adoor' AND district = 'Pathanamthitta') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Adoor', 'Pathanamthitta');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Alappuzha' AND district = 'Alappuzha') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Alappuzha', 'Alappuzha');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Cherthala' AND district = 'Alappuzha') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Cherthala', 'Alappuzha');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kottayam' AND district = 'Kottayam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kottayam', 'Kottayam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Changanassery' AND district = 'Kottayam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Changanassery', 'Kottayam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Idukki' AND district = 'Idukki') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Idukki', 'Idukki');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Thodupuzha' AND district = 'Idukki') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Thodupuzha', 'Idukki');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Ernakulam' AND district = 'Ernakulam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Ernakulam', 'Ernakulam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Aluva' AND district = 'Ernakulam') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Aluva', 'Ernakulam');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Thrissur' AND district = 'Thrissur') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Thrissur', 'Thrissur');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Chalakudy' AND district = 'Thrissur') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Chalakudy', 'Thrissur');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Palakkad' AND district = 'Palakkad') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Palakkad', 'Palakkad');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Ottapalam' AND district = 'Palakkad') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Ottapalam', 'Palakkad');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Malappuram' AND district = 'Malappuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Malappuram', 'Malappuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Tirur' AND district = 'Malappuram') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Tirur', 'Malappuram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kozhikode' AND district = 'Kozhikode') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kozhikode', 'Kozhikode');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Vadakara' AND district = 'Kozhikode') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Vadakara', 'Kozhikode');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Wayanad' AND district = 'Wayanad') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Wayanad', 'Wayanad');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Mananthavady' AND district = 'Wayanad') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Mananthavady', 'Wayanad');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kannur' AND district = 'Kannur') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kannur', 'Kannur');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Thalassery' AND district = 'Kannur') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Thalassery', 'Kannur');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kasaragod' AND district = 'Kasaragod') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kasaragod', 'Kasaragod');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM panchayaths WHERE name = 'Kanhangad' AND district = 'Kasaragod') THEN
    INSERT INTO panchayaths (name, district) VALUES ('Kanhangad', 'Kasaragod');
  END IF;
END $$;

-- Insert sample categories based on your requirements
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pennyekart Free Registration') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('Pennyekart Free Registration', 'Totally free registration with basic level delivery service between 2pm to 6pm', 500, 0, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pennyekart Paid Registration') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('Pennyekart Paid Registration', 'Premium registration with any time delivery between 8am to 7pm', 1000, 500, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'FarmeLife') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('FarmeLife', 'Connected with dairy farm, poultry farm and agricultural businesses', 2000, 1000, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'OrganeLife') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('OrganeLife', 'Connected with vegetable and house gardening, especially terrace vegetable farming', 1500, 750, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'FoodeLife') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('FoodeLife', 'Connected with food processing business and food-related enterprises', 1800, 900, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'EntreLife') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('EntreLife', 'Connected with skilled projects like stitching, art works, various home services', 1200, 600, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Job Card') THEN
    INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) 
    VALUES ('Job Card', 'Special offer card for first-time registrants with investment benefits and convertible to any category', 3000, 1500, true);
  END IF;
END $$;

-- Insert admin users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE username = 'evaadmin') THEN
    INSERT INTO admins (username, password, role) VALUES ('evaadmin', 'eva919123', 'super_admin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin1') THEN
    INSERT INTO admins (username, password, role) VALUES ('admin1', 'elife9094', 'local_admin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin2') THEN
    INSERT INTO admins (username, password, role) VALUES ('admin2', 'penny9094', 'user_admin');
  END IF;
END $$;

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