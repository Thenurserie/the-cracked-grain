const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

// Function to create URL-friendly slug
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function importProducts() {
  const csvPath = '/home/compriv/Downloads/homebrew_products.csv';

  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');

  // Skip header
  const dataLines = lines.slice(1).filter(line => line.trim());

  console.log(`Found ${dataLines.length} products to import`);

  let imported = 0;
  let errors = 0;

  for (const line of dataLines) {
    try {
      // Parse CSV line (handling quoted values)
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      const columns = line.split(regex).map(col => col.trim().replace(/^"|"$/g, ''));

      const [name, sku, priceStr, category, description, type, detailedType, qtyStr] = columns;

      if (!name || !priceStr) {
        console.log(`Skipping row with missing data: ${name}`);
        continue;
      }

      const price = parseFloat(priceStr) || 0;
      const stockQuantity = parseInt(qtyStr) || 0;

      // Generate slug and ensure uniqueness
      let slug = createSlug(name);
      let slugCounter = 1;
      let finalSlug = slug;

      // Check if slug exists
      while (true) {
        const existing = await prisma.product.findUnique({
          where: { slug: finalSlug }
        });

        if (!existing) break;

        finalSlug = `${slug}-${slugCounter}`;
        slugCounter++;
      }

      // Create product
      await prisma.product.create({
        data: {
          name,
          slug: finalSlug,
          sku: sku || null,
          description: description || null,
          category: category || 'Homebrew',
          price,
          unit: 'each',
          stockQuantity,
          lowStockThreshold: 10,
          isActive: true,
        }
      });

      imported++;
      if (imported % 50 === 0) {
        console.log(`Imported ${imported} products...`);
      }
    } catch (error) {
      errors++;
      console.error(`Error importing product: ${line.substring(0, 50)}...`);
      console.error(error.message);
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Successfully imported: ${imported} products`);
  console.log(`Errors: ${errors}`);
}

importProducts()
  .then(() => {
    console.log('Done!');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    prisma.$disconnect();
    process.exit(1);
  });
