#!/usr/bin/env node

/**
 * Setup Directus Recipes Collection
 *
 * This script:
 * 1. Creates the 'recipes' collection in Directus
 * 2. Adds all required fields
 * 3. Imports recipes from recipes-data.json
 */

const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const DIRECTUS_TOKEN = '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${DIRECTUS_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, JSON.stringify(data, null, 2));
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error.message);
    throw error;
  }
}

// ============================================================================
// CREATE COLLECTION
// ============================================================================

async function createCollection() {
  console.log('\n📦 Creating "recipes" collection...');

  try {
    const collection = await apiRequest('/collections', 'POST', {
      collection: 'recipes',
      meta: {
        icon: 'restaurant',
        display_template: '{{name}}',
        hidden: false,
        singleton: false,
        translations: [],
        archive_field: null,
        archive_value: null,
        unarchive_value: null,
        sort_field: null,
      },
      schema: {
        name: 'recipes'
      }
    });

    console.log('✅ Collection created successfully');
    return collection;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('INVALID_PAYLOAD')) {
      console.log('⚠️  Collection already exists, continuing with field setup...');
      return null;
    }
    console.error('Error creating collection:', error.message);
    // Don't throw - continue with field creation
    return null;
  }
}

// ============================================================================
// CREATE FIELDS
// ============================================================================

async function createField(field, type, options = {}) {
  console.log(`  Creating field: ${field}...`);

  try {
    await apiRequest('/fields/recipes', 'POST', {
      field,
      type,
      meta: {
        interface: options.interface || 'input',
        special: options.special || null,
        required: options.required || false,
        options: options.options || null,
        display: options.display || null,
        readonly: options.readonly || false,
        hidden: options.hidden || false,
        width: options.width || 'full',
      },
      schema: {
        is_nullable: !options.required,
        is_unique: options.unique || false,
        has_auto_increment: options.auto_increment || false,
        default_value: options.default || null,
      }
    });
    console.log(`    ✅ ${field}`);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`    ⚠️  ${field} already exists, skipping...`);
    } else {
      console.error(`    ❌ Failed to create ${field}:`, error.message);
    }
  }
}

async function createAllFields() {
  console.log('\n🔧 Creating fields...');

  // Status field with dropdown
  await createField('status', 'string', {
    interface: 'select-dropdown',
    required: true,
    default: 'published',
    options: {
      choices: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' }
      ]
    }
  });

  // Slug - unique identifier
  await createField('slug', 'string', {
    interface: 'input',
    required: true,
    unique: true,
    options: {
      slug: true,
      placeholder: 'recipe-slug'
    }
  });

  // Basic text fields
  await createField('name', 'string', { interface: 'input', required: true });
  await createField('type', 'string', { interface: 'input', required: true });
  await createField('style', 'string', { interface: 'input', required: true });
  await createField('bjcp_style', 'string', { interface: 'input' });
  await createField('difficulty', 'string', {
    interface: 'select-dropdown',
    required: true,
    options: {
      choices: [
        { text: 'Beginner', value: 'Beginner' },
        { text: 'Intermediate', value: 'Intermediate' },
        { text: 'Advanced', value: 'Advanced' }
      ]
    }
  });
  await createField('batch_size', 'string', { interface: 'input', required: true });
  await createField('brew_time', 'string', { interface: 'input', required: true });

  // Description - long text
  await createField('description', 'text', {
    interface: 'input-multiline',
    required: true
  });

  // Featured - boolean
  await createField('featured', 'boolean', {
    interface: 'boolean',
    default: false
  });

  // Stats fields
  await createField('og', 'string', { interface: 'input' });
  await createField('fg', 'string', { interface: 'input' });
  await createField('abv', 'string', { interface: 'input' });
  await createField('ibu', 'string', { interface: 'input' });
  await createField('srm', 'string', { interface: 'input' });
  await createField('color', 'string', { interface: 'input' });
  await createField('boil_time', 'string', { interface: 'input' });
  await createField('total_hops', 'string', { interface: 'input' });
  await createField('fermentation_temp', 'string', { interface: 'input' });

  // JSON fields for complex data
  await createField('methods', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('hops', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('yeast', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('fermentation', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('packaging', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('tips', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });
  await createField('food_pairing', 'json', {
    interface: 'input-code',
    options: {
      language: 'json'
    }
  });

  console.log('✅ All fields created');
}

// ============================================================================
// IMPORT RECIPES
// ============================================================================

async function importRecipes() {
  console.log('\n📥 Importing recipes...');

  const fs = require('fs');
  const path = require('path');

  const recipesFile = path.join(__dirname, 'recipes-data.json');

  if (!fs.existsSync(recipesFile)) {
    console.log('⚠️  recipes-data.json not found, skipping import...');
    return;
  }

  const recipeData = JSON.parse(fs.readFileSync(recipesFile, 'utf8'));

  if (!recipeData.recipes || recipeData.recipes.length === 0) {
    console.log('⚠️  No recipes found in file');
    return;
  }

  console.log(`Found ${recipeData.recipes.length} recipe(s) to import`);

  for (const recipe of recipeData.recipes) {
    try {
      console.log(`  Importing: ${recipe.name}...`);

      // Check if recipe already exists
      const existing = await apiRequest(
        `/items/recipes?filter[slug][_eq]=${recipe.slug}&limit=1`
      );

      if (existing.data && existing.data.length > 0) {
        console.log(`    ⚠️  Recipe "${recipe.name}" already exists, updating...`);
        await apiRequest(
          `/items/recipes/${existing.data[0].id}`,
          'PATCH',
          recipe
        );
        console.log(`    ✅ Updated: ${recipe.name}`);
      } else {
        await apiRequest('/items/recipes', 'POST', recipe);
        console.log(`    ✅ Imported: ${recipe.name}`);
      }
    } catch (error) {
      console.error(`    ❌ Failed to import ${recipe.name}:`, error.message);
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 Starting Directus Recipe Collection Setup');
  console.log(`📍 Directus URL: ${DIRECTUS_URL}`);

  try {
    // Step 1: Create collection
    await createCollection();

    // Step 2: Create all fields
    await createAllFields();

    // Step 3: Import recipes
    await importRecipes();

    console.log('\n✅ Setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit https://admin.thecrackedgrain.com');
    console.log('   2. Check the "recipes" collection');
    console.log('   3. Verify all fields are present');
    console.log('   4. Add remaining recipes manually or via API\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
