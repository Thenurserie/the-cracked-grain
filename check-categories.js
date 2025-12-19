const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get distinct categories with counts
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    console.log('\n=== Product Categories in Database ===\n');
    categories.forEach(cat => {
      console.log(`${cat.category || 'NULL'}: ${cat._count.category} products`);
    });

    // Get sample products
    console.log('\n=== Sample Products ===\n');
    const sampleProducts = await prisma.product.findMany({
      take: 10,
      select: {
        name: true,
        category: true,
        stockQuantity: true
      }
    });

    sampleProducts.forEach(p => {
      console.log(`${p.name} - Category: ${p.category || 'NULL'} - Stock: ${p.stockQuantity}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
