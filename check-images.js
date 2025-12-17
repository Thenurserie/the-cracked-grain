const { PrismaClient } = require('./lib/generated/prisma');

async function checkImages() {
  const prisma = new PrismaClient();

  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
        imageUrl: true,
      },
      take: 10,
    });

    console.log('Sample product images:');
    products.forEach(p => {
      console.log(`${p.name}: ${p.imageUrl || 'NULL'}`);
    });

    const withImages = await prisma.product.count({
      where: {
        imageUrl: {
          not: null,
        },
      },
    });

    const total = await prisma.product.count();

    console.log(`\nTotal products: ${total}`);
    console.log(`Products with images: ${withImages}`);
    console.log(`Products without images: ${total - withImages}`);

  } finally {
    await prisma.$disconnect();
  }
}

checkImages().catch(console.error);
