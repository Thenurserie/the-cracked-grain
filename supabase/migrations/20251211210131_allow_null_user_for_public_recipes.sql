/*
  # Allow null user_id for public recipes

  1. Changes
    - Make user_id nullable in recipes table to allow system/public recipes
    
  2. Security
    - Update RLS policies to handle null user_id for public recipes
*/

-- Make user_id nullable
ALTER TABLE recipes ALTER COLUMN user_id DROP NOT NULL;

-- Update policies to handle public recipes
DROP POLICY IF EXISTS "Users can view own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;

CREATE POLICY "Anyone can view public recipes"
  ON recipes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);