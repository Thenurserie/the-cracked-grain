const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function checkEquipment() {
  try {
    // Get all equipment products
    const equipment = await prisma.product.findMany({
      where: {
        category: 'Equipment'
      },
      select: {
        id: true,
        name: true,
        category: true,
        subcategory: true,
        price: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 30
    });

    console.log('\n=== Equipment Products ===');
    console.log(`Total found: ${equipment.length}\n`);

    equipment.forEach(p => {
      console.log(`- ${p.name}`);
      console.log(`  Category: ${p.category}${p.subcategory ? ` > ${p.subcategory}` : ''}`);
      console.log(`  Price: $${p.price}`);
      console.log(`  ID: ${p.id}\n`);
    });

    // Check for specific search terms
    console.log('\n=== Testing Search Terms ===\n');
    const searchTerms = ['kettle', 'fermenter', 'airlock', 'siphon', 'hydrometer', 'bottles', 'capper', 'star san'];

    for (const term of searchTerms) {
      const results = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } }
          ]
        },
        select: {
          name: true,
          category: true
        }
      });
      console.log(`"${term}": ${results.length} matches`);
      results.forEach(r => console.log(`  - ${r.name} (${r.category})`));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEquipment();
