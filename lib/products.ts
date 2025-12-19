import { prisma } from './db';

export async function getProducts(params?: {
  category?: string;
  subcategory?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { category, subcategory, isActive = true, limit = 50, offset = 0, search } = params || {};

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (subcategory) {
    where.subcategory = subcategory;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: {
      slug: slug,
    },
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  unit?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  imageUrl?: string;
  specifications?: any;
  isActive?: boolean;
}) {
  return await prisma.product.create({
    data: {
      ...data,
      price: data.price,
      stockQuantity: data.stockQuantity || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      unit: data.unit || 'each',
      isActive: data.isActive !== undefined ? data.isActive : true,
      specifications: data.specifications || {},
    },
  });
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  unit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  imageUrl: string;
  specifications: any;
  isActive: boolean;
}>) {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function getLowStockProducts(threshold?: number) {
  return await prisma.product.findMany({
    where: {
      stockQuantity: {
        lte: threshold || 10,
      },
      isActive: true,
    },
    orderBy: { stockQuantity: 'asc' },
  });
}

export async function getProductsByCategory(category: string) {
  return await prisma.product.findMany({
    where: {
      category,
      isActive: true,
    },
    orderBy: { name: 'asc' },
  });
}
