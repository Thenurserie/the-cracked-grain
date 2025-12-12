import { prisma } from './db';

export async function recordInventoryTransaction(params: {
  productId: string;
  transactionType: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantityChange: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  createdBy?: string;
}) {
  const {
    productId,
    transactionType,
    quantityChange,
    referenceId,
    referenceType,
    notes,
    createdBy,
  } = params;

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { stockQuantity: true, lowStockThreshold: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const previousQuantity = product.stockQuantity;
    const newQuantity = previousQuantity + quantityChange;

    if (newQuantity < 0) {
      throw new Error(`Insufficient stock: only ${previousQuantity} available`);
    }

    const transaction = await tx.inventoryTransaction.create({
      data: {
        productId,
        transactionType,
        quantityChange,
        previousQuantity,
        newQuantity,
        referenceId,
        referenceType,
        notes,
        createdBy,
      },
    });

    await tx.product.update({
      where: { id: productId },
      data: { stockQuantity: newQuantity },
    });

    if (newQuantity === 0) {
      await tx.inventoryAlert.create({
        data: {
          productId,
          alertType: 'out_of_stock',
          message: `Product is out of stock`,
        },
      });
    } else if (newQuantity <= product.lowStockThreshold) {
      await tx.inventoryAlert.create({
        data: {
          productId,
          alertType: 'low_stock',
          message: `Product is running low (only ${newQuantity} left)`,
        },
      });
    } else {
      await tx.inventoryAlert.updateMany({
        where: {
          productId,
          isResolved: false,
        },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
      });
    }

    return transaction;
  });
}

export async function getInventoryTransactions(productId: string, limit = 50) {
  return await prisma.inventoryTransaction.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function getActiveAlerts() {
  return await prisma.inventoryAlert.findMany({
    where: { isResolved: false },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          stockQuantity: true,
        },
      },
    },
  });
}

export async function resolveAlert(alertId: string) {
  return await prisma.inventoryAlert.update({
    where: { id: alertId },
    data: {
      isResolved: true,
      resolvedAt: new Date(),
    },
  });
}
