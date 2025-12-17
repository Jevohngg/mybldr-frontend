/*
  # Create Community Lots and Map Tables

  1. New Tables
    - `communities`
      - `id` (text, primary key)
      - `name` (text)
      - `division` (text)
      - `map_image_url` (text, optional)
      - `map_view_box` (jsonb, optional) - SVG viewBox settings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `lots`
      - `id` (uuid, primary key)
      - `lot_number` (text)
      - `community_id` (text, foreign key)
      - `status` (text) - 'available', 'qa', 'reserved', 'sold'
      - `move_in_ready` (boolean)
      - `plan_id` (text, optional)
      - `plan_name` (text, optional)
      - `sqft` (integer, optional)
      - `price` (numeric, optional)
      - `position` (jsonb) - {x, y} coordinates or polygon points
      - `shape_type` (text) - 'polygon', 'rect', 'circle'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS communities (
  id text PRIMARY KEY,
  name text NOT NULL,
  division text,
  map_image_url text,
  map_view_box jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read communities"
  ON communities
  FOR SELECT
  TO public
  USING (true);

CREATE TABLE IF NOT EXISTS lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_number text NOT NULL,
  community_id text NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'available',
  move_in_ready boolean DEFAULT false,
  plan_id text,
  plan_name text,
  sqft integer,
  price numeric,
  position jsonb NOT NULL,
  shape_type text DEFAULT 'polygon',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('available', 'qa', 'reserved', 'sold'))
);

ALTER TABLE lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lots"
  ON lots
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_lots_community_id ON lots(community_id);
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
