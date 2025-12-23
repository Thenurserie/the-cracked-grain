#!/usr/bin/env node

/**
 * Import All 9 Recipes to Directus
 */

const fs = require('fs');
const path = require('path');

const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const DIRECTUS_TOKEN = '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';

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

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    console.error(`API Error (${response.status}):`, JSON.stringify(data, null, 2));
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return data;
}

async function importRecipes() {
  console.log('\n📥 Importing all 9 recipes to Directus...\n');

  const recipesFile = path.join(__dirname, 'all-9-recipes.json');
  const recipeData = JSON.parse(fs.readFileSync(recipesFile, 'utf8'));

  console.log(`Found ${recipeData.recipes.length} recipe(s) to import\n`);

  let imported = 0;
  let updated = 0;
  let failed = 0;

  for (const recipe of recipeData.recipes) {
    try {
      console.log(`  Processing: ${recipe.name}...`);

      // Check if recipe already exists
      const existing = await apiRequest(
        `/items/recipes?filter[slug][_eq]=${recipe.slug}&limit=1`
      );

      if (existing.data && existing.data.length > 0) {
        console.log(`    ⚠️  Already exists, updating...`);
        await apiRequest(
          `/items/recipes/${existing.data[0].id}`,
          'PATCH',
          recipe
        );
        console.log(`    ✅ Updated: ${recipe.name}`);
        updated++;
      } else {
        await apiRequest('/items/recipes', 'POST', recipe);
        console.log(`    ✅ Imported: ${recipe.name}`);
        imported++;
      }
    } catch (error) {
      console.error(`    ❌ Failed: ${recipe.name} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   Imported: ${imported}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${recipeData.recipes.length}\n`);

  if (failed === 0) {
    console.log('✅ All recipes imported successfully!\n');
  } else {
    console.log('⚠️  Some recipes failed to import. Check errors above.\n');
  }
}

async function verifyRecipes() {
  console.log('🔍 Verifying recipes in Directus...\n');

  const recipes = await apiRequest('/items/recipes?filter[status][_eq]=published&limit=-1');

  console.log(`Found ${recipes.data.length} published recipe(s):\n`);

  for (const recipe of recipes.data) {
    console.log(`   ✅ ${recipe.name} (${recipe.slug})`);
  }

  console.log('');

  return recipes.data.length;
}

async function main() {
  console.log('🚀 Recipe Import Script\n');
  console.log(`📍 Directus URL: ${DIRECTUS_URL}\n`);

  try {
    await importRecipes();
    const count = await verifyRecipes();

    if (count === 9) {
      console.log('✅ SUCCESS: All 9 recipes are in Directus!\n');
      console.log('📝 Next steps:');
      console.log('   1. Visit https://clownfish-app-73qds.ondigitalocean.app/recipes');
      console.log('   2. Verify all 9 recipe cards are displaying');
      console.log('   3. Click on each recipe to verify detail pages work\n');
    } else {
      console.log(`⚠️  WARNING: Expected 9 recipes, found ${count}\n`);
    }

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

main();
