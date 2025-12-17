const { PrismaClient } = require('./lib/generated/prisma');
const fs = require('fs');

async function updateProductImages() {
  const prisma = new PrismaClient();

  try {
    // Read the SQL file
    const sql = fs.readFileSync('directus_sideload/import_images.sql', 'utf8');

    // Extract UPDATE statements
    const updatePattern = /UPDATE products SET image = '([^']+)' WHERE slug = '([^']+)'/g;
    const matches = [...sql.matchAll(updatePattern)];

    console.log(`Found ${matches.length} product image mappings`);

    let updated = 0;
    let failed = 0;

    for (const match of matches) {
      const [, imageUuid, slug] = match;

      try {
        await prisma.product.update({
          where: { slug },
          data: { imageUrl: imageUuid },
        });
        updated++;
        if (updated % 50 === 0) {
          console.log(`Updated ${updated} products...`);
        }
      } catch (error) {
        console.error(`Failed to update product ${slug}:`, error.message);
        failed++;
      }
    }

    console.log(`\nUpdate complete:`);
    console.log(`  Successfully updated: ${updated}`);
    console.log(`  Failed: ${failed}`);

  } finally {
    await prisma.$disconnect();
  }
}

updateProductImages().catch(console.error);
