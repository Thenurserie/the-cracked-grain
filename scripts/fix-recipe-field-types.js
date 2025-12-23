#!/usr/bin/env node

/**
 * Fix Recipe Field Types
 *
 * Convert numeric fields to string to support values like "5 gallons", "7.0%", etc.
 */

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

async function updateFieldType(fieldName) {
  console.log(`Updating ${fieldName} to string type...`);

  try {
    await apiRequest(`/fields/recipes/${fieldName}`, 'PATCH', {
      type: 'string',
      schema: {
        data_type: 'character varying'
      }
    });
    console.log(`  ✅ ${fieldName} updated`);
  } catch (error) {
    console.error(`  ❌ Failed to update ${fieldName}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Updating recipe field types...\n');

  const fieldsToUpdate = ['batch_size', 'abv', 'ibu', 'srm'];

  for (const field of fieldsToUpdate) {
    await updateFieldType(field);
  }

  console.log('\n✅ Field types updated!');
  console.log('\nNow run: node scripts/setup-directus-recipes.js');
}

main().catch(console.error);
