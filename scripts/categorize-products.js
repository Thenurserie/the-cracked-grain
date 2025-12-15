const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

// Categorization rules based on product names
const categorizationRules = {
  'Grains': [
    /malt/i,
    /grain/i,
    /extract/i,
    /dme/i,
    /lme/i,
    /wheat/i,
    /barley/i,
    /rye/i,
    /oat/i,
    /munich/i,
    /pilsner/i,
    /caramel/i,
    /crystal/i,
    /pale ale/i,
    /chocolate malt/i,
    /black patent/i,
    /roasted/i,
    /carapils/i,
    /victory/i,
    /vienna/i,
  ],
  'Hops': [
    /hop/i,
    /cascade/i,
    /centennial/i,
    /citra/i,
    /mosaic/i,
    /simcoe/i,
    /amarillo/i,
    /chinook/i,
    /columbus/i,
    /fuggle/i,
    /golding/i,
    /hallertau/i,
    /saaz/i,
    /tettnang/i,
    /pellet/i,
  ],
  'Yeast': [
    /yeast/i,
    /bacteria/i,
    /lactobacillus/i,
    /pediococcus/i,
    /brettanomyces/i,
    /saccharomyces/i,
    /wyeast/i,
    /white labs/i,
    /fermentis/i,
    /safale/i,
    /saflager/i,
  ],
  'Chemicals': [
    /acid/i,
    /sanitizer/i,
    /cleaner/i,
    /campden/i,
    /clarifier/i,
    /nutrient/i,
    /energizer/i,
    /finings/i,
    /iodophor/i,
    /pbw/i,
    /star san/i,
    /one step/i,
    /sodium metabisulfite/i,
    /potassium/i,
    /calcium/i,
    /gypsum/i,
    /irish moss/i,
    /whirlfloc/i,
  ],
};

function categorizeProduct(productName) {
  // Check each category's rules
  for (const [category, rules] of Object.entries(categorizationRules)) {
    for (const rule of rules) {
      if (rule.test(productName)) {
        return category;
      }
    }
  }

  // Default to Equipment if no match
  return 'Equipment';
}

async function main() {
  try {
    console.log('Starting product categorization...\n');

    // Get all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, category: true },
    });

    console.log(`Found ${products.length} active products\n`);

    const categoryStats = {
      'Grains': 0,
      'Hops': 0,
      'Yeast': 0,
      'Chemicals': 0,
      'Equipment': 0,
    };

    // Categorize and update each product
    for (const product of products) {
      const newCategory = categorizeProduct(product.name);
      categoryStats[newCategory]++;

      if (product.category !== newCategory) {
        await prisma.product.update({
          where: { id: product.id },
          data: { category: newCategory },
        });

        // Log first few examples of each category
        if (categoryStats[newCategory] <= 3) {
          console.log(`[${newCategory}] ${product.name}`);
        }
      }
    }

    console.log('\n=== Categorization Results ===');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });

    console.log('\n✓ Categorization complete!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
