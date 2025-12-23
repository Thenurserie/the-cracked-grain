#!/usr/bin/env node

/**
 * Set Public Read Permissions for Recipes Collection
 *
 * Allows unauthenticated users to read published recipes
 */

const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const DIRECTUS_TOKEN = '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';
const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';

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

async function setPublicReadPermission() {
  console.log('🔓 Setting public read permissions for recipes...\n');

  try {
    // Grant public read permission for published recipes
    const permission = await apiRequest('/permissions', 'POST', {
      collection: 'recipes',
      action: 'read',
      policy: PUBLIC_POLICY_ID,
      permissions: {
        status: {
          _eq: 'published'
        }
      },
      fields: '*' // All fields
    });

    console.log('✅ Public read permission granted for published recipes');
    console.log('   Users can now read all published recipes without authentication\n');

    return permission;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('RECORD_NOT_UNIQUE')) {
      console.log('⚠️  Permission already exists');
      return null;
    }
    console.error('❌ Failed to set permission:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🔐 Recipe Permissions Setup\n');

  try {
    await setPublicReadPermission();

    console.log('✅ Setup complete!');
    console.log('\n📝 What this means:');
    console.log('   - Anyone can read published recipes (no auth required)');
    console.log('   - Draft recipes remain private');
    console.log('   - Static generation during build will work\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
