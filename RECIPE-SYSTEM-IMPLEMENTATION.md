# RECIPE SYSTEM - Directus Implementation Plan

## CURRENT PROBLEM

Recipes are stored in static TypeScript file (`lib/data/recipes-data.ts`). This is architecturally wrong because:
- No connection to your Directus CMS
- Cannot link ingredients to actual products
- Cannot save user recipes
- No authentication integration

## IMPLEMENTATION STEPS

### STEP 1: Create Directus Collections (Manual - Use Directus Admin UI)

Go to https://admin.thecrackedgrain.com and create these collections:

#### Collection: `recipes`

| Field Name          | Type          | Interface     | Required | Unique | Notes |
|---------------------|---------------|---------------|----------|--------|-------|
| id                  | UUID          | Input         | Auto     | Yes    | Primary Key |
| status              | String        | Dropdown      | Yes      | No     | Values: "published", "draft" |
| slug                | String        | Input         | Yes      | Yes    | URL-friendly |
| name                | String        | Input         | Yes      | No     | Display name |
| type                | String        | Dropdown      | Yes      | No     | Values: "Beer", "Wine", "Mead", "Cider", "Kombucha" |
| style               | String        | Input         | Yes      | No     | e.g. "American IPA" |
| bjcp_style          | String        | Input         | No       | No     | e.g. "21A - American IPA" |
| difficulty          | String        | Dropdown      | Yes      | No     | Values: "Beginner", "Intermediate", "Advanced" |
| batch_size          | String        | Input         | Yes      | No     | e.g. "5 gallons" |
| brew_time           | String        | Input         | Yes      | No     | e.g. "4 weeks" |
| description         | Text          | Textarea      | Yes      | No     | Full description |
| featured            | Boolean       | Toggle        | No       | No     | Default: false |
| og                  | String        | Input         | No       | No     | Original Gravity |
| fg                  | String        | Input         | No       | No     | Final Gravity |
| abv                 | String        | Input         | No       | No     | Alcohol by Volume |
| ibu                 | String        | Input         | No       | No     | International Bitterness Units |
| srm                 | String        | Input         | No       | No     | Standard Reference Method (color) |
| color               | String        | Input         | No       | No     | Color description |
| methods             | JSON          | Code          | No       | No     | Brewing methods array |
| hops                | JSON          | Code          | No       | No     | Hop additions array |
| total_hops          | String        | Input         | No       | No     | Total hops summary |
| boil_time           | String        | Input         | No       | No     | Boil duration |
| yeast               | JSON          | Code          | No       | No     | Yeast options array |
| fermentation_temp   | String        | Input         | No       | No     | Fermentation temperature |
| fermentation        | JSON          | Code          | No       | No     | Fermentation schedule array |
| packaging           | JSON          | Code          | No       | No     | Packaging details object |
| tips                | JSON          | Code          | No       | No     | Tips object (dos, donts) |
| food_pairing        | JSON          | Code          | No       | No     | Food pairing array |
| date_created        | DateTime      | DateTime      | Auto     | No     | Timestamp |
| date_updated        | DateTime      | DateTime      | Auto     | No     | Timestamp |

#### Collection: `recipe_ingredients`

| Field Name          | Type          | Interface     | Required | Notes |
|---------------------|---------------|---------------|----------|-------|
| id                  | UUID          | Input         | Auto     | Primary Key |
| recipe_id           | Many-to-One   | Relation      | Yes      | Links to recipes.id |
| product_id          | Many-to-One   | Relation      | Yes      | Links to products.id |
| method_type         | String        | Dropdown      | No       | Values: "all-grain", "lme", "dme", "all" |
| ingredient_type     | String        | Dropdown      | Yes      | Values: "fermentable", "hop", "yeast", "other" |
| amount              | String        | Input         | No       | e.g. "10", "1.5" |
| unit                | String        | Input         | No       | e.g. "lb", "oz", "packet" |
| timing              | String        | Input         | No       | For hops: "60 min", "dry-hop", etc |
| notes               | Text          | Textarea      | No       | Special notes |
| sort_order          | Integer       | Input         | No       | Display order |

#### Collection: `user_recipes`

| Field Name          | Type          | Interface     | Required | Notes |
|---------------------|---------------|---------------|----------|-------|
| id                  | UUID          | Input         | Auto     | Primary Key |
| user_id             | Many-to-One   | Relation      | Yes      | Links to directus_users.id |
| source_recipe_id    | Many-to-One   | Relation      | No       | Links to recipes.id (if cloned) |
| name                | String        | Input         | Yes      | Recipe name |
| is_custom           | Boolean       | Toggle        | No       | true if user created from scratch |
| recipe_data         | JSON          | Code          | No       | Full recipe data if modified |
| notes               | Text          | Textarea      | No       | User's personal notes |
| date_created        | DateTime      | DateTime      | Auto     | Timestamp |
| date_updated        | DateTime      | DateTime      | Auto     | Timestamp |

### STEP 2: Import Recipe Data

Use the Directus admin UI to manually create the 9 recipes, OR use the import script:

```bash
# Install dependencies if needed
npm install @directus/sdk

# Run the import script
node scripts/import-recipes.js
```

The script will read from `scripts/recipes-data.json` and import all recipes to Directus.

NOTE: I've only included Ozark Echo IPA in recipes-data.json. You need to add the remaining 8 recipes from the full JSON I provided.

### STEP 3: Map Ingredients to Products

For each recipe, create entries in `recipe_ingredients` that link recipe ingredients to actual products in your inventory.

Example for "Ozark Echo IPA" All-Grain method:

1. Go to Directus admin
2. Find the "Ozark Echo IPA" recipe ID
3. Find the product IDs for:
   - American 2-Row Pale Malt
   - Caramel/Crystal 40L
   - Centennial Hops
   - Safale US-05 Yeast
4. Create `recipe_ingredients` entries linking them

### STEP 4: Delete Static File

Once recipes are in Directus:

```bash
rm lib/data/recipes-data.ts
```

### STEP 5: Update Frontend

The recipe pages need to fetch from Directus API instead of static files.

Files that need updating:
- `app/recipes/page.tsx` - Fetch recipes from Directus
- `app/recipes/[slug]/page.tsx` - Fetch single recipe from Directus
- Add cart integration with real products

---

## FILES CREATED

1. `/scripts/create-recipe-collections.sql` - SQL to create tables (if not using Directus UI)
2. `/scripts/recipes-data.json` - Recipe data for import (only 1 recipe so far)
3. This README

## NEXT STEPS

1. Create the collections in Directus admin UI
2. Add all 9 recipes to `scripts/recipes-data.json`
3. Import recipes using script or manually
4. Map ingredients to products
5. Update frontend to fetch from Directus
6. Delete static file

---

## WHY THIS MATTERS

The static TypeScript file approach means:
- ❌ Cart buttons don't work with real products
- ❌ Can't save recipes to user library
- ❌ Can't track which ingredients are in stock
- ❌ Can't update recipes without redeploying code
- ❌ No admin UI for managing recipes

With Directus:
- ✅ Recipes managed through admin UI
- ✅ Cart integration with real products and prices
- ✅ Users can save recipes (requires auth)
- ✅ Track inventory levels
- ✅ Update recipes without code changes
- ✅ Full CMS capabilities
