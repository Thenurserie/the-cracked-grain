import { prisma } from './db';
import { recordInventoryTransaction } from './inventory';

function generateOrderNumber(): string {
  return `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
}

export async function createOrder(params: {
  userId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: any;
  billingAddress?: any;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  notes?: string;
}) {
  const {
    userId,
    customerEmail,
    customerName,
    shippingAddress,
    billingAddress,
    items,
    notes,
  } = params;

  return await prisma.$transaction(async (tx) => {
    let orderNumber = generateOrderNumber();
    let attempts = 0;

    while (attempts < 5) {
      const existing = await tx.order.findUnique({
        where: { orderNumber },
      });

      if (!existing) break;

      orderNumber = generateOrderNumber();
      attempts++;
    }

    const productIds = items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
      };
    });

    const tax = subtotal * 0.08;
    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shippingCost;

    const order = await tx.order.create({
      data: {
        userId,
        orderNumber,
        customerEmail,
        customerName,
        shippingAddress,
        billingAddress,
        subtotal,
        tax,
        shippingCost,
        total,
        notes,
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    for (const item of items) {
      await recordInventoryTransaction({
        productId: item.productId,
        transactionType: 'sale',
        quantityChange: -item.quantity,
        referenceId: order.id,
        referenceType: 'order',
        notes: `Order ${orderNumber}`,
        createdBy: userId,
      });
    }

    return order;
  });
}

export async function getOrder(orderId: string, userId?: string) {
  const where: any = { id: orderId };

  if (userId) {
    where.userId = userId;
  }

  return await prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
