/*
  # Create health recommendations table

  1. New Tables
    - `health_recommendations`
      - `id` (uuid, primary key)
      - `exam_type` (text)
      - `topic_id` (text)
      - `title` (text)
      - `content` (text)
      - `categories` (text[])
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `health_recommendations` table
    - Add policy for authenticated users to read recommendations
    - Add policy for service role to manage recommendations
*/

CREATE TABLE IF NOT EXISTS health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type text NOT NULL,
  topic_id text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  categories text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read recommendations
CREATE POLICY "Users can read health recommendations"
  ON health_recommendations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage recommendations
CREATE POLICY "Service role can manage health recommendations"
  ON health_recommendations
  USING (auth.role() = 'service_role');

-- Add updated_at trigger
CREATE TRIGGER health_recommendations_updated_at
  BEFORE UPDATE ON health_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();