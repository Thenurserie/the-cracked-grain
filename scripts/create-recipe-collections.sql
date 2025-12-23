-- ============================================================================
-- THE CRACKED GRAIN - RECIPE SYSTEM COLLECTIONS
-- ============================================================================
-- Run this SQL to create the recipe collections in your PostgreSQL database
-- ============================================================================

-- Collection: recipes (Public recipe library)
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(255) DEFAULT 'draft',
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    style VARCHAR(255) NOT NULL,
    bjcp_style VARCHAR(255),
    difficulty VARCHAR(50) NOT NULL,
    batch_size VARCHAR(50) NOT NULL,
    brew_time VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,

    -- Stats
    og VARCHAR(10),
    fg VARCHAR(10),
    abv VARCHAR(10),
    ibu VARCHAR(10),
    srm VARCHAR(10),
    color VARCHAR(50),

    -- Complex data stored as JSON
    methods JSONB,
    hops JSONB,
    total_hops VARCHAR(255),
    boil_time VARCHAR(50),
    yeast JSONB,
    fermentation_temp VARCHAR(50),
    fermentation JSONB,
    packaging JSONB,
    tips JSONB,
    food_pairing JSONB,

    -- Optional fields
    clone_inspiration VARCHAR(255),

    -- Timestamps
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_type ON recipes(type);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_featured ON recipes(featured);

-- Collection: recipe_ingredients (Links recipes to products)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    method_type VARCHAR(50) DEFAULT 'all',
    ingredient_type VARCHAR(50) NOT NULL,
    amount VARCHAR(50),
    unit VARCHAR(50),
    timing VARCHAR(100),
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_product ON recipe_ingredients(product_id);

-- Collection: user_recipes (User's personal saved recipes)
CREATE TABLE IF NOT EXISTS user_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    source_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    recipe_data JSONB,
    notes TEXT,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_recipes_user ON user_recipes(user_id);
CREATE INDEX idx_user_recipes_source ON user_recipes(source_recipe_id);

-- Add update trigger for date_updated
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_modtime
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_recipes_modtime
    BEFORE UPDATE ON user_recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
